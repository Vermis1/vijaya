#  Vijaya
Plataforma moderna de contenido sobre cannabis, cultura y comunidad construida con Next.js 14, TypeScript, Supabase y TailwindCSS.

![Vijaya](https://img.shields.io/badge/version-1.0.0-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-14-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

##  Características

###  Frontend
- **Next.js 14** con App Router
- **TypeScript** para type safety
- **TailwindCSS** + diseño minimalista Vijaya
- **Shadcn/UI** componentes
- **ISR** (Incremental Static Regeneration)
- **Responsive** design

###  Editor
- **TipTap** editor estilo Notion
- Texto enriquecido completo
- Imágenes, videos, enlaces
- Blockquotes, listas, código
- Guardado en JSON

###  Autenticación & Roles
- Login / Registro con Supabase Auth
- 5 roles: Admin, Editor, Journalist, Author, User
- Middleware de protección de rutas
- Row Level Security (RLS)

###  Blog
- Artículos con cover image
- Sistema de tags
- Comentarios anidados
- Like/Dislike en comentarios
- Favoritos
- Búsqueda y filtros

###  Panel Admin Completo
- Dashboard con estadísticas
- Gestión de artículos (CRUD)
- Sistema de aprobación de contenido
- Moderación de comentarios
- Gestión de usuarios y roles
- Sponsors con ubicaciones
- Anuncios / Google Adsense
- Configuración del sitio

###  Monetización
- Sistema de sponsors
- Google Adsense integrado
- Ubicaciones personalizables

##  Instalación

### Prerequisitos
- Node.js 18+
- Cuenta de Supabase
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/vijaya.git
cd vijaya
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=tu-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configurar Supabase

Ve al SQL Editor en Supabase y ejecuta el contenido de:
```bash
supabase/schema.sql
```

Esto creará:
- Todas las tablas necesarias
- Row Level Security policies
- Funciones y triggers
- Configuración inicial

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

##  Estructura del Proyecto

```
vijaya/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── admin/
│   │   ├── articles/
│   │   ├── users/
│   │   ├── comments/
│   │   ├── sponsors/
│   │   ├── ads/
│   │   └── settings/
│   ├── article/[slug]/
│   ├── blog/
│   ├── profile/
│   ├── tienda/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   ├── article/
│   ├── auth/
│   ├── editor/
│   ├── profile/
│   └── ui/
├── lib/
│   ├── supabase/
│   └── utils.ts
├── supabase/
│   └── schema.sql
├── types/
│   └── index.ts
└── middleware.ts
```

##  Identidad Visual

### Colores Vijaya
```css
--vijaya-green: #3E8C67    /* Verde cannabis */
--vijaya-lime: #B5DDA5     /* Verde lima suave */
--vijaya-brown: #CCB08A    /* Marrón madera */
--vijaya-beige: #F4F1E8    /* Beige */
--vijaya-black: #111111    /* Negro suave */
```

### Tipografías
- **Headings:** Space Grotesk
- **Body:** Inter

### Diseño
- Minimalista y juvenil
- Mucho aire (spacing)
- Sombras suaves
- Bordes redondeados: 10-12px
- Animaciones sutiles

##  Roles y Permisos

| Rol | Crear Artículos | Editar Propios | Editar Todos | Moderar | Admin Panel |
|-----|----------------|----------------|--------------|---------|-------------|
| **User** | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Author** | ✅ | ✅ | ❌ | ❌ | Parcial |
| **Journalist** | ✅ | ✅ | ❌ | ❌ | Parcial |
| **Editor** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ |

##  Deploy en Vercel

1. **Push a GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Importar en Vercel**
- Ve a [vercel.com](https://vercel.com)
- Import repository
- Configura las variables de entorno
- Deploy

3. **Configurar dominio**
- Agrega tu dominio personalizado
- Actualiza `NEXT_PUBLIC_SITE_URL` en variables de entorno

## 🛠 Scripts Disponibles

```bash
npm run dev      # Desarrollo
npm run build    # Build para producción
npm run start    # Servidor de producción
npm run lint     # Lint del código
```

##  Stack Tecnológico

- **Framework:** Next.js 14
- **Lenguaje:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Styling:** TailwindCSS
- **UI Components:** Shadcn/UI + Radix UI
- **Editor:** TipTap
- **Forms:** React Hook Form + Zod
- **State:** Zustand (opcional)
- **Deploy:** Vercel

##  Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

##  Licencia

Este proyecto está bajo la Licencia MIT.

##  Agradecimientos

- Next.js Team
- Supabase Team
- Shadcn por los componentes UI
- TipTap por el editor
- Comunidad Open Source

---
 **Vijaya** - Construido con 💚 para la comunidad cannabis
