import { createServerSupabaseClient } from '@/lib/supabase/server';
import { DashboardStats } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { formatDate, formatRelativeTime } from '@/lib/utils';

async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServerSupabaseClient();

  // Total de artículos
  const { count: total_articles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true });

  // Artículos publicados
  const { count: published_articles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published');

  // Artículos pendientes
  const { count: pending_articles } = await supabase
    .from('articles')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending_review');

  // Total de usuarios
  const { count: total_users } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true });

  // Total de comentarios
  const { count: total_comments } = await supabase
    .from('comments')
    .select('*', { count: 'exact', head: true });

  // Total de vistas (suma de todas las vistas)
  const { data: viewsData } = await supabase
    .from('articles')
    .select('views');
  
  const total_views = viewsData?.reduce((sum, article) => sum + (article.views || 0), 0) || 0;

  // Top artículos (más vistos)
  const { data: topArticles } = await supabase
    .from('articles')
    .select(`
      *,
      author:users(id, username, avatar_url)
    `)
    .eq('status', 'published')
    .order('views', { ascending: false })
    .limit(5);

  // Comentarios recientes
  const { data: recentComments } = await supabase
    .from('comments')
    .select(`
      *,
      user:users(id, username, avatar_url),
      article:articles(id, title, slug)
    `)
    .order('created_at', { ascending: false })
    .limit(5);

  return {
    total_articles: total_articles || 0,
    published_articles: published_articles || 0,
    pending_articles: pending_articles || 0,
    total_users: total_users || 0,
    total_comments: total_comments || 0,
    total_views,
    top_articles: topArticles || [],
    recent_comments: recentComments || [],
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Bienvenido al panel de administración de Vijaya
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-vijaya-lime/30 rounded-vijaya flex items-center justify-center">
              <svg
                className="w-6 h-6 text-vijaya-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-vijaya-black mb-1">
            {stats.total_articles}
          </div>
          <div className="text-sm text-gray-600">Total Artículos</div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.published_articles} publicados
          </div>
        </div>

        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-vijaya flex items-center justify-center">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-vijaya-black mb-1">
            {stats.pending_articles}
          </div>
          <div className="text-sm text-gray-600">Pendientes</div>
          <Link href="/admin/articles?status=pending_review" className="mt-2 text-xs text-vijaya-green hover:underline">
            Ver artículos →
          </Link>
        </div>

        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-vijaya flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-vijaya-black mb-1">
            {stats.total_users}
          </div>
          <div className="text-sm text-gray-600">Usuarios</div>
          <Link href="/admin/users" className="mt-2 text-xs text-vijaya-green hover:underline">
            Gestionar usuarios →
          </Link>
        </div>

        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-vijaya flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-vijaya-black mb-1">
            {stats.total_views.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Vistas</div>
          <div className="mt-2 text-xs text-gray-500">
            {stats.total_comments} comentarios
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Articles */}
        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-vijaya-black">
              Artículos más leídos
            </h2>
            <Link 
              href="/admin/articles"
              className="text-sm text-vijaya-green hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {stats.top_articles.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay artículos todavía</p>
            ) : (
              stats.top_articles.map((article, index) => (
                <div key={article.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-vijaya-lime/30 rounded-full flex items-center justify-center text-vijaya-green font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link 
                      href={`/article/${article.slug}`}
                      className="font-medium text-vijaya-black hover:text-vijaya-green line-clamp-1"
                    >
                      {article.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                      <span>{article.author?.username}</span>
                      <span>•</span>
                      <span>{article.views || 0} vistas</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-bold text-vijaya-black">
              Comentarios recientes
            </h2>
            <Link 
              href="/admin/comments"
              className="text-sm text-vijaya-green hover:underline"
            >
              Ver todos
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recent_comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay comentarios todavía</p>
            ) : (
              stats.recent_comments.map((comment) => (
                <div key={comment.id} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-start gap-3 mb-2">
                    {comment.user?.avatar_url && (
                      <Image
                        src={comment.user.avatar_url}
                        alt={comment.user.username}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm text-vijaya-black">
                          {comment.user?.username}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {comment.content}
                      </p>
                      <Link
                        href={`/article/${comment.article?.slug}`}
                        className="text-xs text-vijaya-green hover:underline mt-1 inline-block"
                      >
                        en "{comment.article?.title}"
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="vijaya-card p-6">
        <h2 className="text-xl font-heading font-bold text-vijaya-black mb-4">
          Acciones rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link 
            href="/admin/articles/create"
            className="p-4 border-2 border-dashed border-vijaya-green rounded-vijaya hover:bg-vijaya-green/5 transition-colors group"
          >
            <div className="text-vijaya-green text-center">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-medium">Crear Artículo</span>
            </div>
          </Link>

          <Link 
            href="/admin/users"
            className="p-4 border-2 border-dashed border-gray-300 rounded-vijaya hover:border-vijaya-green hover:bg-vijaya-green/5 transition-colors group"
          >
            <div className="text-gray-600 group-hover:text-vijaya-green text-center transition-colors">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              <span className="font-medium">Gestionar Usuarios</span>
            </div>
          </Link>

          <Link 
            href="/admin/settings"
            className="p-4 border-2 border-dashed border-gray-300 rounded-vijaya hover:border-vijaya-green hover:bg-vijaya-green/5 transition-colors group"
          >
            <div className="text-gray-600 group-hover:text-vijaya-green text-center transition-colors">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium">Configuración</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}