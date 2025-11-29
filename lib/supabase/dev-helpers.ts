import { supabaseAdmin } from './client';

export async function autoConfirmUser(email: string) {
  if (process.env.NODE_ENV === 'development') {
    const { data } = await supabaseAdmin.auth.admin.listUsers();
    const user = data.users.find(u => u.email === email);
    
    if (user && !user.email_confirmed_at) {
      await supabaseAdmin.auth.admin.updateUserById(user.id, {
        email_confirm: true
      });
    }
  }
}
