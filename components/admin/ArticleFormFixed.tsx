'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TipTapEditor from '@/components/editor/TipTapEditor';
import { slugify } from '@/lib/utils';
import { Article } from '@/types';
import { 
  getPublishedAtForUpdate, 
  validateArticleData, 
  normalizeTags,
  getStatusChangeWarning,
  ArticleStatus 
} from '@/lib/article-helpers';
import { 
  validateUniqueSlug, 
  generateUniqueSlug, 
  sanitizeSlug,
  validateImageUrl 
} from '@/lib/article-validation';
import { 
  getReadableErrorMessage, 
  getValidationErrorMessage,
  getSuccessMessage 
} from '@/lib/error-messages';

interface ArticleFormProps {
  userId: string;
  article?: Article;
}

export default function ArticleFormFixed({ userId, article }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [validatingSlug, setValidatingSlug] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    coverImage: article?.cover_image || '',
    tags: article?.tags.join(', ') || '',
    content: article?.content || null,
    status: article?.status || 'draft' as ArticleStatus,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-generate slug from title only when creating new article
      if (name === 'title' && !article) {
        const autoSlug = slugify(value);
        newData.slug = autoSlug;
        // Clear slug error when title changes
        setSlugError(null);
      }
      
      return newData;
    });
  };

  const handleSlugBlur = async () => {
    if (!formData.slug) return;

    // Sanitize slug first
    const sanitized = sanitizeSlug(formData.slug);
    if (!sanitized.valid) {
      setSlugError(sanitized.error || 'Slug inválido');
      return;
    }

    // Update with sanitized value if different
    if (sanitized.sanitized !== formData.slug) {
      setFormData(prev => ({ ...prev, slug: sanitized.sanitized! }));
    }

    // Validate uniqueness
    setValidatingSlug(true);
    setSlugError(null);
    
    const validation = await validateUniqueSlug(sanitized.sanitized!, article?.id);
    
    if (!validation.valid) {
      setSlugError(validation.error || 'Este slug ya está en uso');
    }
    
    setValidatingSlug(false);
  };

  const handleSubmit = async (e: React.FormEvent, statusOverride?: ArticleStatus) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const targetStatus = statusOverride || formData.status;

    try {
      // Client-side validation
      const validation = validateArticleData(formData);
      if (!validation.valid) {
        setError(getValidationErrorMessage(validation.errors));
        setLoading(false);
        return;
      }

      // Validate image URL if provided
      if (formData.coverImage && !validateImageUrl(formData.coverImage)) {
        setError('La URL de la imagen no es válida. Asegúrate de usar una URL completa (http:// o https://)');
        setLoading(false);
        return;
      }

      // Validate slug uniqueness
      const slugValidation = await validateUniqueSlug(formData.slug, article?.id);
      if (!slugValidation.valid) {
        // Try to generate a unique slug
        const uniqueSlug = await generateUniqueSlug(formData.slug, article?.id);
        
        // Ask user if they want to use the suggested slug
        const userConfirmed = confirm(
          `El slug "${formData.slug}" ya está en uso.\n\n` +
          `¿Deseas usar "${uniqueSlug}" en su lugar?`
        );
        
        if (!userConfirmed) {
          setError(slugValidation.error || 'El slug ya está en uso');
          setLoading(false);
          return;
        }
        
        // Update slug with unique version
        setFormData(prev => ({ ...prev, slug: uniqueSlug }));
        formData.slug = uniqueSlug;
      }

      // Check if status change needs confirmation
      if (article) {
        const warning = getStatusChangeWarning(article.status, targetStatus);
        if (warning.needsConfirmation) {
          const confirmed = confirm(warning.message);
          if (!confirmed) {
            setLoading(false);
            return;
          }
        }
      }

      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Normalize tags
      const tagsArray = normalizeTags(formData.tags);

      // Prepare article data
      const articleData: any = {
        title: formData.title.trim(),
        slug: formData.slug,
        content: formData.content,
        cover_image: formData.coverImage.trim() || null,
        tags: tagsArray,
        status: targetStatus,
        author_id: userId,
        updated_at: new Date().toISOString(),
      };

      if (article) {
        // UPDATE existing article
        
        // Calculate correct published_at
        const publishedAt = getPublishedAtForUpdate(
          article.status,
          targetStatus,
          article.published_at
        );
        
        if (publishedAt !== null) {
          articleData.published_at = publishedAt;
        }

        const { error: updateError } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id);

        if (updateError) throw updateError;

        setSuccess(getSuccessMessage('update', formData.title));
        
        // Redirect after short delay to show success message
        setTimeout(() => {
          router.push('/admin/articles');
          router.refresh();
        }, 1500);

      } else {
        // CREATE new article
        
        // Set published_at for new published articles
        if (targetStatus === 'published') {
          articleData.published_at = new Date().toISOString();
        }

        const { error: insertError } = await supabase
          .from('articles')
          .insert([articleData]);

        if (insertError) throw insertError;

        // Determine success message based on status
        let operation: 'create' | 'draft' | 'submit' | 'publish' = 'create';
        if (targetStatus === 'published') operation = 'publish';
        else if (targetStatus === 'pending_review') operation = 'submit';
        else if (targetStatus === 'draft') operation = 'draft';

        setSuccess(getSuccessMessage(operation, formData.title));
        
        // Redirect after short delay to show success message
        setTimeout(() => {
          router.push('/admin/articles');
          router.refresh();
        }, 1500);
      }

    } catch (error: any) {
      console.error('Error saving article:', error);
      setError(getReadableErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-vijaya bg-red-50 border-2 border-red-200 text-red-700 animate-fade-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="font-medium text-sm whitespace-pre-line">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-4 rounded-vijaya bg-green-50 border-2 border-green-200 text-green-700 animate-fade-in">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-medium text-sm">{success}</p>
          </div>
        </div>
      )}

      {/* Form Fields */}
      <div className="vijaya-card p-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">
            Título <span className="text-red-500">*</span>
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Ej: Guía completa de cultivo orgánico"
            required
            disabled={loading}
            maxLength={200}
          />
          <p className="text-xs text-gray-500">
            {formData.title.length}/200 caracteres
          </p>
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">
            Slug (URL) <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              onBlur={handleSlugBlur}
              placeholder="guia-completa-cultivo-organico"
              required
              disabled={loading || validatingSlug}
              maxLength={100}
              className={slugError ? 'border-red-300 focus-visible:border-red-500' : ''}
            />
            {validatingSlug && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-vijaya-olive border-t-transparent"></div>
              </div>
            )}
          </div>
          {slugError && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {slugError}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Se genera automáticamente del título. Solo letras minúsculas, números y guiones. {formData.slug.length}/100
          </p>
        </div>

        {/* Cover Image */}
        <div className="space-y-2">
          <Label htmlFor="coverImage">Imagen de portada (URL)</Label>
          <Input
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            placeholder="https://ejemplo.com/imagen.jpg"
            disabled={loading}
            type="url"
          />
          {formData.coverImage && validateImageUrl(formData.coverImage) && (
            <div className="mt-3 p-3 bg-gray-50 rounded-vijaya">
              <p className="text-xs text-gray-600 mb-2">Vista previa:</p>
              <img
                src={formData.coverImage}
                alt="Preview"
                className="w-full max-w-md h-48 object-cover rounded-vijaya"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}
          {formData.coverImage && !validateImageUrl(formData.coverImage) && (
            <p className="text-xs text-amber-600">URL de imagen inválida</p>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">
            Tags <span className="text-red-500">*</span>
          </Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="cultivo, salud, cbd, orgánico"
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            Separa los tags con comas. Mínimo 1, máximo 10 tags. Ejemplo: cultivo, salud, cbd
          </p>
          {formData.tags && (
            <div className="flex flex-wrap gap-2 mt-2">
              {normalizeTags(formData.tags).map((tag, idx) => (
                <span key={idx} className="text-xs bg-vijaya-beige text-vijaya-olive px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Status Indicator (readonly display) */}
        {article && (
          <div className="p-4 bg-gray-50 rounded-vijaya">
            <Label className="text-sm text-gray-600 mb-2 block">Estado actual del artículo</Label>
            <span className={`
              inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
              ${article.status === 'published' ? 'bg-green-100 text-green-700' : ''}
              ${article.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''}
              ${article.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' : ''}
              ${article.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
            `}>
              {article.status === 'published' && 'Publicado'}
              {article.status === 'draft' && 'Borrador'}
              {article.status === 'pending_review' && 'En revisión'}
              {article.status === 'rejected' && 'Rechazado'}
            </span>
            {article.published_at && (
              <p className="text-xs text-gray-500 mt-2">
                Publicado: {new Date(article.published_at).toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Editor */}
      <div className="vijaya-card p-6 space-y-4">
        <Label>
          Contenido <span className="text-red-500">*</span>
        </Label>
        <TipTapEditor
          content={formData.content}
          onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          placeholder="Empieza a escribir tu artículo... Usa la barra de herramientas para dar formato al texto."
        />
        <p className="text-xs text-gray-500">
          Tip: Usa los encabezados (H1, H2, H3) para estructurar tu contenido y mejorar el SEO
        </p>
      </div>

      {/* Action Buttons */}
      <div className="vijaya-card p-6">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 font-medium">Elige cómo guardar tu artículo:</p>
          
          <div className="flex flex-wrap items-center gap-4">
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, 'draft')}
              disabled={loading}
              variant="outline"
              size="lg"
            >
              {loading ? 'Guardando...' : 'Guardar como borrador'}
            </Button>

            <Button
              type="button"
              onClick={(e) => handleSubmit(e, 'pending_review')}
              disabled={loading}
              variant="secondary"
              size="lg"
            >
              {loading ? 'Enviando...' : 'Enviar a revisión'}
            </Button>

            <Button
              type="button"
              onClick={(e) => handleSubmit(e, 'published')}
              disabled={loading}
              size="lg"
            >
              {loading ? 'Publicando...' : 'Publicar ahora'}
            </Button>

            <Button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              variant="ghost"
              size="lg"
            >
              Cancelar
            </Button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <span className="text-red-500">*</span> Campos obligatorios
            </p>
            <ul className="text-xs text-gray-500 mt-2 space-y-1 list-disc list-inside">
              <li><strong>Borrador:</strong> Solo tú puedes verlo. Úsalo para guardar tu progreso.</li>
              <li><strong>Revisión:</strong> Los editores lo revisarán antes de publicar.</li>
              <li><strong>Publicar:</strong> El artículo será visible públicamente de inmediato.</li>
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}