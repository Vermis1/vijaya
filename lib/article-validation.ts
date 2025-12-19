import { supabase } from '@/lib/supabase/client';

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
    error: 'Este slug ya está en uso. Prueba con otro nombre o modifícalo manualmente.' 
  };
}

export function generateUniqueSlugCandidate(baseSlug: string, attempt: number = 0): string {
  return attempt === 0 ? baseSlug : `${baseSlug}-${attempt}`;
}