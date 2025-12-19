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

  // Si no existe, es válido
  if (!data) {
    return { valid: true };
  }

  // Si existe pero es el mismo artículo (edición), es válido
  if (articleId && data.id === articleId) {
    return { valid: true };
  }

  // Si existe y es otro artículo, no válido
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
 * Limpia y normaliza un slug para URL
 */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Genera un slug único definitivo usando los helpers existentes
 */
export async function generateUniqueSlug(
  title: string,
  articleId?: string
): Promise<string> {
  const baseSlug = sanitizeSlug(title);
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
