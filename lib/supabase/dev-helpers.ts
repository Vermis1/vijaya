import { createServerClient } from '@supabase/ssr';

export async function autoConfirmUser(email: string) {
  if (process.env.NODE_ENV !== 'development') return;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // service role aquí
    {
      cookies: {
        get() {
          return '';
        },
        set() {},
        remove() {}
      }
    }
  );

  // Obtener usuario por email
  const { data: userData } = await supabase.auth.admin.listUsers();
  const user = userData?.users?.find(u => u.email === email);

  if (user && !user.email_confirmed_at) {
    await supabase.auth.admin.updateUserById(user.id, {
      email_confirm: true,
    });
  }
}
