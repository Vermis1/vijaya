import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Article } from '@/types';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

async function getArticles(status?: string): Promise<Article[]> {
  const supabase = createServerSupabaseClient();
  
  let query = supabase
    .from('articles')
    .select(`
      *,
      author:users(id, username, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data || [];
}

export default async function AdminArticlesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const articles = await getArticles(searchParams.status);
  const status = searchParams.status || 'all';

  const statusCounts = {
    all: articles.length,
    draft: articles.filter(a => a.status === 'draft').length,
    pending_review: articles.filter(a => a.status === 'pending_review').length,
    published: articles.filter(a => a.status === 'published').length,
    rejected: articles.filter(a => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-2">
            Artículos
          </h1>
          <p className="text-gray-600">
            Gestiona todos los artículos de la plataforma
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/articles/create">
            + Nuevo Artículo
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="vijaya-card p-6">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/articles"
            className={`px-4 py-2 rounded-vijaya text-sm font-medium transition-colors ${
              status === 'all'
                ? 'bg-vijaya-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos ({statusCounts.all})
          </Link>
          <Link
            href="/admin/articles?status=published"
            className={`px-4 py-2 rounded-vijaya text-sm font-medium transition-colors ${
              status === 'published'
                ? 'bg-vijaya-green text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Publicados ({statusCounts.published})
          </Link>
          <Link
            href="/admin/articles?status=pending_review"
            className={`px-4 py-2 rounded-vijaya text-sm font-medium transition-colors ${
              status === 'pending_review'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pendientes ({statusCounts.pending_review})
          </Link>
          <Link
            href="/admin/articles?status=draft"
            className={`px-4 py-2 rounded-vijaya text-sm font-medium transition-colors ${
              status === 'draft'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Borradores ({statusCounts.draft})
          </Link>
          <Link
            href="/admin/articles?status=rejected"
            className={`px-4 py-2 rounded-vijaya text-sm font-medium transition-colors ${
              status === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rechazados ({statusCounts.rejected})
          </Link>
        </div>
      </div>

      {/* Search & Actions */}
      <div className="vijaya-card p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="search"
            placeholder="Buscar artículos..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-vijaya focus:outline-none focus:ring-2 focus:ring-vijaya-green"
          />
          <select className="px-4 py-2 border border-gray-300 rounded-vijaya focus:outline-none focus:ring-2 focus:ring-vijaya-green">
            <option>Ordenar por: Fecha (más reciente)</option>
            <option>Ordenar por: Fecha (más antiguo)</option>
            <option>Ordenar por: Título (A-Z)</option>
            <option>Ordenar por: Vistas</option>
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="vijaya-card overflow-hidden">
        {articles.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500 mb-4">No hay artículos con este filtro</p>
            <Button asChild variant="outline">
              <Link href="/admin/articles/create">Crear primer artículo</Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Título
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Autor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Vistas
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="max-w-md">
                        <Link 
                          href={`/admin/articles/edit/${article.id}`}
                          className="font-medium text-vijaya-black hover:text-vijaya-green line-clamp-1"
                        >
                          {article.title}
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span 
                              key={tag}
                              className="text-xs bg-vijaya-lime/20 text-vijaya-green px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {article.author?.username}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                        ${article.status === 'published' ? 'bg-green-100 text-green-700' : ''}
                        ${article.status === 'draft' ? 'bg-gray-100 text-gray-700' : ''}
                        ${article.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700' : ''}
                        ${article.status === 'rejected' ? 'bg-red-100 text-red-700' : ''}
                      `}>
                        {article.status === 'published' && 'Publicado'}
                        {article.status === 'draft' && 'Borrador'}
                        {article.status === 'pending_review' && 'Pendiente'}
                        {article.status === 'rejected' && 'Rechazado'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {article.views || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {formatDate(article.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {article.status === 'published' && (
                          <Link
                            href={`/article/${article.slug}`}
                            target="_blank"
                            className="text-sm text-gray-600 hover:text-vijaya-green transition-colors"
                          >
                            Ver
                          </Link>
                        )}
                        <Link
                          href={`/admin/articles/edit/${article.id}`}
                          className="text-sm text-vijaya-green hover:underline"
                        >
                          Editar
                        </Link>
                        <button className="text-sm text-red-600 hover:underline">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}