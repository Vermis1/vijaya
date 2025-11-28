import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession, getUserProfile } from '@/lib/supabase/server';
import ArticleForm from '@/components/admin/ArticleForm';

export const metadata: Metadata = {
  title: 'Crear Artículo - Admin - Vijaya',
  description: 'Crear un nuevo artículo',
};

export default async function CreateArticlePage() {
  const session = await getSession();
  const profile = await getUserProfile();

  if (!session || !profile) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-2">
          Crear Artículo
        </h1>
        <p className="text-gray-600">
          Completa el formulario para crear un nuevo artículo
        </p>
      </div>

      {/* Form */}
      <ArticleForm userId={profile.id} />
    </div>
  );
}