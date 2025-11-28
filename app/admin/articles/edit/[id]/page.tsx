import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { createServerSupabaseClient, getSession, getUserProfile } from '@/lib/supabase/server';
import { Article } from '@/types';
import ArticleForm from '@/components/admin/ArticleForm';

export const metadata: Metadata = {
  title: 'Editar Artículo - Admin - Vijaya',
  description: 'Editar artículo existente',
};

async function getArticle(id: string): Promise<Article | null> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:users(id, username, avatar_url)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  return data;
}

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();
  const profile = await getUserProfile();

  if (!session || !profile) {
    redirect('/login');
  }

  const article = await getArticle(params.id);

  if (!article) {
    notFound();
  }

  // Verificar que el usuario puede editar este artículo
  const canEdit = 
    article.author_id === profile.id ||
    ['admin', 'editor'].includes(profile.role);

  if (!canEdit) {
    redirect('/admin/articles');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-2">
          Editar Artículo
        </h1>
        <p className="text-gray-600">
          Modificando: <span className="font-medium">{article.title}</span>
        </p>
      </div>

      {/* Form */}
      <ArticleForm userId={profile.id} article={article} />
    </div>
  );
}