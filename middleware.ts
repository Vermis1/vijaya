// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware central de autenticación y control de sesiones.
 * - Compatible con Next.js 14 (App Router) y @supabase/ssr
 * - Maneja cookies correctamente para que Supabase pueda persistir sesión en Vercel
 * - Protege rutas /profile y /admin
 * - Redirige usuarios según rol cuando intentan acceder a /login o /register
 *
 * Pegá este archivo exactamente (no acortar nada importante).
 */

function safeSetCookie(
  res: NextResponse,
  name: string,
  value: string,
  options: Partial<{
    path: string;
    maxAge: number;
    expires: string | number | Date;
    httpOnly: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    secure: boolean;
  }> = {}
) {
  // NextResponse.cookies.set acepta objeto con propiedades
  try {
    res.cookies.set({
      name,
      value,
      path: options.path ?? '/',
      httpOnly: options.httpOnly ?? true,
      secure: options.secure ?? true,
      sameSite: options.sameSite ?? 'lax',
      ...(options.maxAge !== undefined ? { maxAge: options.maxAge } : {}),
      ...(options.expires !== undefined ? { expires: options.expires } : {}),
    } as any);
  } catch (e) {
    // No bloquear la ejecución si la API cambia en el entorno
    // fallbacks: intentar set por nombre/valor
    try {
      // @ts-ignore
      res.cookies.set(name, value);
    } catch (_) {
      // swallow
    }
  }
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Crear cliente Supabase (forma correcta para middleware en Next 14)
  const supabase = createServerClient(
    {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    },
    {
      // adaptador de cookies para Next 14 middleware
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options?: any) {
          // Usar wrapper seguro para asegurar propiedades esenciales
          safeSetCookie(res, name, value, {
            path: options?.path ?? '/',
            maxAge: options?.maxAge,
            expires: options?.expires,
            httpOnly: options?.httpOnly ?? true,
            sameSite: options?.sameSite ?? 'lax',
            secure: options?.secure ?? true,
          });
        },
        remove(name: string) {
          // Borrar cookie estableciendo maxAge 0 y valor vacío
          safeSetCookie(res, name, '', { path: '/', maxAge: 0, httpOnly: true, sameSite: 'lax', secure: true });
        },
      },
    }
  );

  // Obtener sesión desde Supabase (usará cookies adaptadas arriba)
  const { data: { session } = { session: null } } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));

  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isAdminPage = pathname.startsWith('/admin');
  const isProfilePage = pathname === '/profile';

  // Evitar proteger assets y rutas internas de Next
  // (config matcher debe hacer lo suyo, esto es redundante y seguro)
  const skip = pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.') || pathname === '/favicon.ico';
  if (skip) return res;

  // Si no hay sesión y quiere rutas protegidas => redirect a login
  if (!session && (isAdminPage || isProfilePage)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si está autenticado
  if (session) {
    // Si intenta acceder a login/register, redirigir según rol
    if (isAuthPage) {
      const { data: userData, error: userErr } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()
        .catch(() => ({ data: null, error: true }));

      const role = userData?.role as string | undefined;

      if (role && (role === 'admin' || role === 'editor')) {
        return NextResponse.redirect(new URL('/admin', req.url));
      } else {
        return NextResponse.redirect(new URL('/profile', req.url));
      }
    }

    // Si intenta acceder a /admin, verificar rol
    if (isAdminPage) {
      const { data: userData, error: userErr } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()
        .catch(() => ({ data: null, error: true }));

      const role = userData?.role as string | undefined;
      if (userData && !['admin', 'editor'].includes(role ?? '')) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
