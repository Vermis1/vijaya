import { redirect } from 'next/navigation';
import { getSession, getUserProfile } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminClientProviders from './AdminClientProviders';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const profile = await getUserProfile();

  // No logueado o sin perfil → login
  if (!session || !profile) {
    redirect('/login');
  }

  // Logueado pero sin permisos → profile
  if (!['admin', 'editor'].includes(profile.role)) {
    redirect('/profile');
  }

  return (
    <AdminClientProviders>
      <div className="min-h-screen bg-vijaya-beige flex">
        <AdminSidebar user={profile} />

        <div className="flex-1 flex flex-col">
          <AdminHeader user={profile} />

          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminClientProviders>
  );
}
