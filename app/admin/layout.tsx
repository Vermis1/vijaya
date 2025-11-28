import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession, getUserProfile } from '@/lib/supabase/server';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const profile = await getUserProfile();

  // Verificar que el usuario tenga rol de admin o editor
  if (!session || !profile || !['admin', 'editor'].includes(profile.role)) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-vijaya-beige flex">
      {/* Sidebar */}
      <AdminSidebar user={profile} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <AdminHeader user={profile} />

        {/* Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}