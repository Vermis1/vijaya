# Archivos para Eliminar

Este archivo lista código obsoleto/duplicado que debe eliminarse manualmente.

## Archivos Duplicados

### app/admin/ArticleForm.tsx
- **Razón:** Duplicado exacto de `components/admin/ArticleForm.tsx`
- **Estado:** No se usa en ninguna parte
- **Acción:** Eliminar el archivo completo
- **Comando:** `rm app/admin/ArticleForm.tsx`

## Verificación

Después de eliminar, verificar que la app compile:
```bash
npm run build
```

Si hay errores, significa que algún archivo importaba el duplicado.
En ese caso, actualizar los imports a `@/components/admin/ArticleForm`