export type ArticleStatus = 'draft' | 'pending_review' | 'published' | 'rejected';

/**
 * Determines the correct published_at value for article updates
 * @param currentStatus - Current status of the article (before update)
 * @param newStatus - New status being set
 * @param currentPublishedAt - Current published_at value (null if never published)
 * @returns The correct published_at value or null
 */
export function getPublishedAtForUpdate(
  currentStatus: ArticleStatus | undefined,
  newStatus: ArticleStatus,
  currentPublishedAt: string | null | undefined
): string | null {
  // If article was already published, ALWAYS preserve original publish date
  if (currentPublishedAt) {
    return currentPublishedAt;
  }
  
  // If changing from non-published to published, set current timestamp
  if (newStatus === 'published' && currentStatus !== 'published') {
    return new Date().toISOString();
  }
  
  // In all other cases, leave as null
  return null;
}

/**
 * Determines if an article status change requires confirmation
 * @param currentStatus - Current article status
 * @param newStatus - Proposed new status
 * @returns Object with needsConfirmation flag and warning message
 */
export function getStatusChangeWarning(
  currentStatus: ArticleStatus,
  newStatus: ArticleStatus
): { needsConfirmation: boolean; message?: string } {
  // Unpublishing a published article
  if (currentStatus === 'published' && newStatus !== 'published') {
    return {
      needsConfirmation: true,
      message: '⚠️ Estás a punto de despublicar este artículo. Los lectores ya no podrán verlo. ¿Continuar?'
    };
  }

  // Rejecting an article under review
  if (currentStatus === 'pending_review' && newStatus === 'rejected') {
    return {
      needsConfirmation: true,
      message: '⚠️ Estás rechazando este artículo. El autor será notificado. ¿Continuar?'
    };
  }

  return { needsConfirmation: false };
}

/**
 * Validates article data before submission
 * @param data - Article form data
 * @returns Validation result with errors array
 */
export function validateArticleData(data: {
  title: string;
  content: any;
  slug: string;
  tags: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push('El título es obligatorio');
  } else if (data.title.trim().length < 3) {
    errors.push('El título debe tener al menos 3 caracteres');
  } else if (data.title.length > 200) {
    errors.push('El título no puede exceder 200 caracteres');
  }

  // Content validation
  if (!data.content) {
    errors.push('El contenido es obligatorio');
  } else {
    // Check if TipTap content is actually empty
    const hasContent = checkTipTapContent(data.content);
    if (!hasContent) {
      errors.push('El contenido no puede estar vacío');
    }
  }

  // Slug validation
  if (!data.slug || data.slug.trim().length === 0) {
    errors.push('El slug es obligatorio');
  } else if (!/^[a-z0-9-]+$/.test(data.slug)) {
    errors.push('El slug solo puede contener letras minúsculas, números y guiones');
  } else if (data.slug.length > 100) {
    errors.push('El slug no puede exceder 100 caracteres');
  }

  // Tags validation
  const tagsArray = data.tags
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  if (tagsArray.length === 0) {
    errors.push('Debes agregar al menos un tag');
  } else if (tagsArray.length > 10) {
    errors.push('No puedes agregar más de 10 tags');
  } else {
    const invalidTags = tagsArray.filter(tag => tag.length > 30);
    if (invalidTags.length > 0) {
      errors.push(`Algunos tags son muy largos (máx. 30 caracteres): ${invalidTags.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Checks if TipTap JSON content has actual text
 * @param content - TipTap JSON content
 * @returns true if content has text, false if empty
 */
function checkTipTapContent(content: any): boolean {
  if (!content || typeof content !== 'object') {
    return false;
  }

  // Recursive function to find text nodes
  function hasTextNode(node: any): boolean {
    if (node.type === 'text' && node.text && node.text.trim().length > 0) {
      return true;
    }
    
    if (node.content && Array.isArray(node.content)) {
      return node.content.some(hasTextNode);
    }
    
    return false;
  }

  return hasTextNode(content);
}

/**
 * Normalizes tags array
 * @param tags - Comma-separated tags string
 * @returns Normalized tags array
 */
export function normalizeTags(tags: string): string[] {
  return tags
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0 && tag.length <= 30)
    .slice(0, 10); // Max 10 tags
}