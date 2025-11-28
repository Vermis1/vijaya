import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Comment } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import CommentActions from '@/components/admin/CommentActions';

async function getComments(): Promise<Comment[]> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      user:users(id, username, avatar_url),
      article:articles(id, title, slug)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data || [];
}

async function getCommentStats() {
  const comments = await getComments();

  const stats = {
    total: comments.length,
    reported: comments.filter(c => c.reported).length,
    recent: comments.filter(c => {
      const oneDay = 24 * 60 * 60 * 1000;
      return new Date().getTime() - new Date(c.created_at).getTime() < oneDay;
    }).length,
  };

  return stats;
}

export default async function AdminCommentsPage() {
  const comments = await getComments();
  const stats = await getCommentStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-2">
          Comentarios
        </h1>
        <p className="text-gray-600">
          Modera y gestiona los comentarios de la comunidad
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-heading font-bold text-vijaya-green">
              {stats.total}
            </div>
            <svg
              className="w-10 h-10 text-vijaya-green/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <div className="text-sm text-gray-600">Total comentarios</div>
        </div>

        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-heading font-bold text-red-600">
              {stats.reported}
            </div>
            <svg
              className="w-10 h-10 text-red-600/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="text-sm text-gray-600">Reportados</div>
        </div>

        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-3xl font-heading font-bold text-vijaya-green">
              {stats.recent}
            </div>
            <svg
              className="w-10 h-10 text-vijaya-green/30"
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
          <div className="text-sm text-gray-600">Últimas 24h</div>
        </div>
      </div>

      {/* Filters */}
      <div className="vijaya-card p-6">
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 bg-vijaya-green text-white rounded-vijaya text-sm font-medium">
            Todos
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-vijaya text-sm font-medium transition-colors">
            Reportados
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-vijaya text-sm font-medium transition-colors">
            Recientes
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="vijaya-card p-12 text-center">
            <p className="text-gray-500">No hay comentarios todavía</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div 
              key={comment.id} 
              className={`vijaya-card p-6 ${comment.reported ? 'border-2 border-red-300' : ''}`}
            >
              <div className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {comment.user?.avatar_url ? (
                    <Image
                      src={comment.user.avatar_url}
                      alt={comment.user.username}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-vijaya-lime/30 rounded-full flex items-center justify-center">
                      <span className="text-vijaya-green font-heading font-bold">
                        {comment.user?.username?.[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-vijaya-black">
                          {comment.user?.username}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatRelativeTime(comment.created_at)}
                        </span>
                        {comment.reported && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                            Reportado
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/article/${comment.article?.slug}`}
                        className="text-sm text-vijaya-green hover:underline"
                      >
                        en "{comment.article?.title}"
                      </Link>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">
                    {comment.content}
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {comment.likes || 0}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                        </svg>
                        {comment.dislikes || 0}
                      </span>
                    </div>

                    <CommentActions commentId={comment.id} reported={comment.reported} />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}