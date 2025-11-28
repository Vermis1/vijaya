import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getSession, getUserProfile, createServerSupabaseClient } from '@/lib/supabase/server';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import ProfileForm from '@/components/profile/ProfileForm';

export const metadata: Metadata = {
  title: 'Mi Perfil - Vijaya',
  description: 'Gestiona tu perfil y tus artículos',
};

async function getUserArticles(userId: string): Promise<Article[]> {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .from('articles')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  return data || [];
}

async function getFavoriteArticles(userId: string): Promise<Article[]> {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .from('favorites')
    .select(`
      article:articles(
        *,
        author:users(id, username, avatar_url)
      )
    `)
    .eq('user_id', userId);

  return data?.map(f => f.article).filter(Boolean) || [];
}

export default async function ProfilePage() {
  const session = await getSession();
  const profile = await getUserProfile();

  if (!session || !profile) {
    redirect('/login');
  }

  const articles = await getUserArticles(profile.id);
  const favorites = await getFavoriteArticles(profile.id);

  const stats = {
    published: articles.filter(a => a.status === 'published').length,
    drafts: articles.filter(a => a.status === 'draft').length,
    pending: articles.filter(a => a.status === 'pending_review').length,
    favorites: favorites.length,
  };

  return (
    <div className="min-h-screen bg-vijaya-beige">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-heading font-bold text-vijaya-green">
              Vijaya
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/blog" className="text-gray-700 hover:text-vijaya-green transition-colors">
                Blog
              </Link>
              {profile.role === 'admin' || profile.role === 'editor' ? (
                <Link 
                  href="/admin" 
                  className="text-gray-700 hover:text-vijaya-green transition-colors"
                >
                  Admin
                </Link>
              ) : null}
              <Link href="/profile" className="text-vijaya-green font-medium">
                Perfil
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="vijaya-card p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                {profile.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.username}
                    width={120}
                    height={120}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-30 h-30 bg-vijaya-lime/30 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-heading font-bold text-vijaya-green">
                      {profile.username[0].toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-heading font-bold text-vijaya-black mb-2">
                  {profile.username}
                </h1>
                <p className="text-gray-600 mb-4">{profile.email}</p>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-vijaya-lime/30 text-vijaya-green rounded-vijaya text-sm font-medium">
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    Miembro desde {formatDate(profile.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="vijaya-card p-6 text-center">
              <div className="text-3xl font-heading font-bold text-vijaya-green mb-2">
                {stats.published}
              </div>
              <div className="text-sm text-gray-600">Publicados</div>
            </div>
            <div className="vijaya-card p-6 text-center">
              <div className="text-3xl font-heading font-bold text-vijaya-green mb-2">
                {stats.drafts}
              </div>
              <div className="text-sm text-gray-600">Borradores</div>
            </div>
            <div className="vijaya-card p-6 text-center">
              <div className="text-3xl font-heading font-bold text-vijaya-green mb-2">
                {stats.pending}
              </div>
              <div className="text-sm text-gray-600">En revisión</div>
            </div>
            <div className="vijaya-card p-6 text-center">
              <div className="text-3xl font-heading font-bold text-vijaya-green mb-2">
                {stats.favorites}
              </div>
              <div className="text-sm text-gray-600">Favoritos</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex gap-8">
                <button className="pb-4 border-b-2 border-vijaya-green text-vijaya-green font-medium">
                  Mis Artículos
                </button>
                <button className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-vijaya-green">
                  Favoritos
                </button>
                <button className="pb-4 border-b-2 border-transparent text-gray-600 hover:text-vijaya-green">
                  Configuración
                </button>
              </nav>
            </div>
          </div>

          {/* Articles List */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-heading font-bold">Mis Artículos</h2>
              <Link 
                href="/admin/articles/create" 
                className="vijaya-btn text-sm"
              >
                + Nuevo Artículo
              </Link>
            </div>

            {articles.length === 0 ? (
              <div className="vijaya-card p-12 text-center">
                <p className="text-gray-500 mb-4">No has creado ningún artículo todavía</p>
                <Link href="/admin/articles/create" className="vijaya-btn-outline text-sm">
                  Crear mi primer artículo
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div key={article.id} className="vijaya-card p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-heading font-semibold text-vijaya-black">
                            {article.title}
                          </h3>
                          <span className={`
                            px-3 py-1 rounded-full text-xs font-medium
                            ${article.status === 'published' ? 'bg-green-100 text-green-700' : ''}
                            ${article.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''}
                            ${article.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${article.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                          `}>
                            {article.status === 'published' && 'Publicado'}
                            {article.status === 'draft' && 'Borrador'}
                            {article.status === 'pending_review' && 'En revisión'}
                            {article.status === 'rejected' && 'Rechazado'}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">
                          {formatDate(article.created_at)}
                        </p>
                        <div className="flex items-center gap-2">
                          {article.tags.slice(0, 3).map((tag) => (
                            <span 
                              key={tag}
                              className="text-xs bg-vijaya-lime/20 text-vijaya-green px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {article.status === 'published' && (
                          <Link
                            href={`/article/${article.slug}`}
                            className="px-4 py-2 text-sm border border-vijaya-green text-vijaya-green rounded-vijaya hover:bg-vijaya-green hover:text-white transition-colors"
                          >
                            Ver
                          </Link>
                        )}
                        <Link
                          href={`/admin/articles/edit/${article.id}`}
                          className="px-4 py-2 text-sm bg-vijaya-green text-white rounded-vijaya hover:bg-opacity-90 transition-colors"
                        >
                          Editar
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-vijaya-black text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-heading font-bold mb-4">Vijaya</div>
          <p className="text-white/70">© 2024 Vijaya. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}