'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TipTapEditor from '@/components/editor/TipTapEditor';
import { slugify } from '@/lib/utils';
import { Article } from '@/types';

interface ArticleFormProps {
  userId: string;
  article?: Article;
}

export default function ArticleForm({ userId, article }: ArticleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: article?.title || '',
    slug: article?.slug || '',
    coverImage: article?.cover_image || '',
    tags: article?.tags.join(', ') || '',
    content: article?.content || null,
    status: article?.status || 'draft',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Auto-generate slug from title
      ...(name === 'title' && !article ? { slug: slugify(value) } : {}),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, status?: string) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validations
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      setLoading(false);
      return;
    }

    if (!formData.content) {
      setError('El contenido es obligatorio');
      setLoading(false);
      return;
    }

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const articleData = {
        title: formData.title,
        slug: formData.slug || slugify(formData.title),
        content: formData.content,
        cover_image: formData.coverImage || null,
        tags: tagsArray,
        status: status || formData.status,
        author_id: userId,
        updated_at: new Date().toISOString(),
      };

      if (article) {
        // Update existing article
        const { error: updateError } = await supabase
          .from('articles')
          .update(articleData)
          .eq('id', article.id);

        if (updateError) throw updateError;

        router.push('/admin/articles');
        router.refresh();
      } else {
        // Create new article
        const { data, error: insertError } = await supabase
          .from('articles')
          .insert([articleData])
          .select()
          .single();

        if (insertError) throw insertError;

        if (status === 'published') {
          // Update published_at if publishing
          await supabase
            .from('articles')
            .update({ published_at: new Date().toISOString() })
            .eq('id', data.id);
        }

        router.push('/admin/articles');
        router.refresh();
      }
    } catch (error: any) {
      setError(error.message || 'Error al guardar el artículo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-6">
      {error && (
        <div className="p-4 rounded-vijaya bg-red-50 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      <div className="vijaya-card p-6 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Título *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Título del artículo"
            required
            disabled={loading}
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            placeholder="titulo-del-articulo"
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            Se genera automáticamente del título. Puedes personalizarlo.
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
          />
          {formData.coverImage && (
            <div className="mt-2">
              <img
                src={formData.coverImage}
                alt="Preview"
                className="w-full max-w-md h-48 object-cover rounded-vijaya"
              />
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (separados por coma)</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="cultivo, salud, cbd, recetas"
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            Ejemplo: cultivo, salud, cbd
          </p>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Estado actual</Label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-vijaya focus:outline-none focus:ring-2 focus:ring-vijaya-green"
            disabled={loading}
          >
            <option value="draft">Borrador</option>
            <option value="pending_review">Pendiente de revisión</option>
            <option value="published">Publicado</option>
            <option value="rejected">Rechazado</option>
          </select>
        </div>
      </div>

      {/* Editor */}
      <div className="vijaya-card p-6 space-y-4">
        <Label>Contenido *</Label>
        <TipTapEditor
          content={formData.content}
          onChange={(content) => setFormData(prev => ({ ...prev, content }))}
          placeholder="Empieza a escribir tu artículo..."
        />
      </div>

      {/* Actions */}
      <div className="vijaya-card p-6">
        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'draft')}
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Guardando...' : 'Guardar como borrador'}
          </Button>

          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'pending_review')}
            disabled={loading}
            variant="secondary"
          >
            {loading ? 'Guardando...' : 'Enviar a revisión'}
          </Button>

          <Button
            type="button"
            onClick={(e) => handleSubmit(e, 'published')}
            disabled={loading}
          >
            {loading ? 'Publicando...' : 'Publicar ahora'}
          </Button>

          <Button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            variant="ghost"
          >
            Cancelar
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-4">
          * Campos obligatorios
        </p>
      </div>
    </form>
  );
}