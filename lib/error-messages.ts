export function getReadableErrorMessage(error: any): string {
    const errorMessage = error?.message || '';
  
    // Mapeo de errores comunes de Supabase
    const errorMap: Record<string, string> = {
      'duplicate key value violates unique constraint "articles_slug_key"':
        'Este slug ya está en uso. Por favor, elige otro nombre para el artículo.',
  
      'duplicate key value violates unique constraint':
        'Ya existe un registro con estos datos. Por favor, verifica los campos únicos.',
  
      'new row violates row-level security policy':
        'No tienes permisos para realizar esta acción.',
  
      'permission denied':
        'No tienes permisos suficientes para esta operación.',
  
      'JWT expired':
        'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  
      'Failed to fetch':
        'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.',
  
      'invalid input syntax for type uuid':
        'ID de artículo inválido.',
  
      'null value in column':
        'Falta información obligatoria. Verifica que todos los campos requeridos estén completos.',
    };
  
    // Buscar coincidencia exacta
    if (errorMap[errorMessage]) {
      return errorMap[errorMessage];
    }
  
    // Buscar coincidencia parcial
    for (const [key, value] of Object.entries(errorMap)) {
      if (errorMessage.includes(key)) {
        return value;
      }
    }
  
    // Si no hay coincidencia, mensaje genérico
    if (errorMessage.includes('duplicate')) {
      return 'Ya existe un registro con estos datos. Por favor, modifica los campos únicos.';
    }
  
    if (errorMessage.includes('permission') || errorMessage.includes('policy')) {
      return 'No tienes permisos para realizar esta acción.';
    }
  
    // Mensaje genérico final
    return 'Ocurrió un error al guardar el artículo. Por favor, intenta nuevamente.';
  }
  
  export function getValidationErrorMessage(error: unknown): string {
    return getReadableErrorMessage(error);
  }
  export function getSuccessMessage(
    action?: string,
    title?: string
  ): string {
    switch (action) {
      case 'create':
        return title
          ? `Artículo creado correctamente: "${title}"`
          : 'Artículo creado correctamente';
  
      case 'update':
        return title
          ? `Artículo actualizado correctamente: "${title}"`
          : 'Artículo actualizado correctamente';
  
      case 'delete':
        return title
          ? `Artículo eliminado correctamente: "${title}"`
          : 'Artículo eliminado correctamente';
  
      default:
        if (typeof action === 'string') {
          return action;
        }
  
        return 'Operación realizada con éxito';
    }
  }