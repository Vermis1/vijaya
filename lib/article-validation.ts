import { supabase } from '@/lib/supabase/client';

/**
 * Valida que el slug sea único
 */
export async function validateUniqueSlug(
  slug: string,
  articleId?: string
): Promise<{ valid: boolean; error?: string }> {
  const { data, error } = await supabase
    .from('articles')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    return { valid: false, error: 'Error al verificar slug' };
  }

  if (!data) {
    return { valid: true };
  }

  if (articleId && data.id === articleId) {
    return { valid: true };
  }

  return {
    valid: false,
    error:
      'Este slug ya está en uso. Prueba con otro nombre o modifícalo manualmente.',
  };
}

/**
 * Genera un slug candidato agregando sufijo incremental
 */
export function generateUniqueSlugCandidate(
  baseSlug: string,
  attempt: number = 0
): string {
  return attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
}

/**
 * Sanitiza y valida un slug (FORMA ESPERADA POR ArticleForm)
 */
export function sanitizeSlug(input: string): {
  valid: boolean;
  value?: string;
  error?: string;
} {
  if (!input || typeof input !== 'string') {
    return {
      valid: false,
      error: 'El slug no puede estar vacío',
    };
  }

  const sanitized = input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  if (!sanitized) {
    return {
      valid: false,
      error: 'El slug resultante es inválido',
    };
  }

  return {
    valid: true,
    value: sanitized,
  };
}

/**
 * Genera un slug único definitivo
 */
export async function generateUniqueSlug(
  title: string,
  articleId?: string
): Promise<string> {
  const sanitized = sanitizeSlug(title);

  if (!sanitized.valid || !sanitized.value) {
    throw new Error(sanitized.error || 'Slug inválido');
  }

  const baseSlug = sanitized.value;
  let attempt = 0;

  while (true) {
    const candidate = generateUniqueSlugCandidate(baseSlug, attempt);
    const validation = await validateUniqueSlug(candidate, articleId);

    if (validation.valid) {
      return candidate;
    }

    attempt++;
  }
}
