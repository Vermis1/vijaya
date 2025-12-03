import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Crear cliente Supabase válido para middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return req.cookies.get(name)?.value;
        },
        set(name, value, options) {
          res.cookies.set(name, value, options);
        },
        remove(name, options) {
          res.cookies.set(name, "", {
            ...options,
            maxAge: 0
          });
        }
      }
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAuthPage =
    req.nextUrl.pathname === "/login" ||
    req.nextUrl.pathname === "/register";

  const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
  const isProfilePage = req.nextUrl.pathname === "/profile";

  // Usuario NO autenticado y quiere acceder a rutas protegidas
  if (!session && (isAdminPage || isProfilePage)) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Usuario autenticado
  if (session) {
    // Intento de entrar a login/register → redirigir
    if (isAuthPage) {
      const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (user && ["admin", "editor"].includes(user.role)) {
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        return NextResponse.redirect(new URL("/profile", req.url));
      }
    }

    // Intento de acceder a /admin sin permisos
    if (isAdminPage) {
      const { data: user } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (user && !["admin", "editor"].includes(user.role)) {
        return NextResponse.redirect(new URL("/", req.url));
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
