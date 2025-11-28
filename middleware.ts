import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => {
          // Next 14: set(name, value, options)
          res.cookies.set(name, value, options);
        },
        remove: (name) => {
          // Next 14: delete(name) SOLO acepta 1 parámetro
          res.cookies.delete(name);
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Rutas protegidas
  const protectedRoutes = ['/profile', '/admin', '/article/create'];
  const isProtected = protectedRoutes.some((r) =>
    req.nextUrl.pathname.startsWith(r)
  );

  if (isProtected && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Restricción de roles para /admin
  if (req.nextUrl.pathname.startsWith('/admin') && session) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!user || !['admin', 'editor'].includes(user.role)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  // Evitar que usuarios logueados entren a login/register
  if (
    session &&
    (req.nextUrl.pathname === '/login' ||
      req.nextUrl.pathname === '/register')
  ) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
