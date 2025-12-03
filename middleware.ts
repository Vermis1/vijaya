import { createMiddlewareClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Obtener sesión
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthPage = req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register';
  const isAdminPage = req.nextUrl.pathname.startsWith('/admin');
  const isProfilePage = req.nextUrl.pathname === '/profile';

  // Si no hay sesión y trata de acceder a páginas protegidas
  if (!session && (isAdminPage || isProfilePage)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Si hay sesión
  if (session) {
    // Si está en login/register, redirigir según rol
    if (isAuthPage) {
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (user && ['admin', 'editor'].includes(user.role)) {
        return NextResponse.redirect(new URL('/admin', req.url));
      } else {
        return NextResponse.redirect(new URL('/profile', req.url));
      }
    }

    // Si trata de acceder a /admin, verificar rol
    if (isAdminPage) {
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (user && !['admin', 'editor'].includes(user.role)) {
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