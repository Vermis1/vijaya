'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase/client';
import { Comment } from '@/types';
import { formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
    checkUser();
  }, [articleId]);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      setUser(profile);
    }
  };

  const loadComments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        user:users(id, username, avatar_url)
      `)
      .eq('article_id', articleId)
      .is('parent_id', null)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setComments(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    const { error } = await supabase
      .from('comments')
      .insert({
        article_id: articleId,
        user_id: user.id,
        content: newComment.trim(),
        likes: 0,
        dislikes: 0,
        reported: false,
      });

    if (!error) {
      setNewComment('');
      loadComments();
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Cargando comentarios...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-heading font-bold text-vijaya-black">
          Comentarios ({comments.length})
        </h2>
      </div>

      {/* Comment Form */}
      {user ? (
        <form onSubmit={handleSubmit} className="vijaya-card p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              {user.avatar_url ? (
                <Image
                  src={user.avatar_url}
                  alt={user.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-vijaya-lime/30 rounded-full flex items-center justify-center">
                  <span className="text-vijaya-green font-bold">
                    {user.username[0].toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe tu comentario..."
                className="w-full px-4 py-3 border border-gray-300 rounded-vijaya focus:outline-none focus:ring-2 focus:ring-vijaya-green resize-none"
                rows={3}
                disabled={submitting}
              />
              <div className="flex justify-end mt-3">
                <Button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  size="sm"
                >
                  {submitting ? 'Publicando...' : 'Comentar'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="vijaya-card p-6 text-center">
          <p className="text-gray-600 mb-4">
            Debes iniciar sesión para comentar
          </p>
          <Button asChild variant="outline" size="sm">
            <a href="/login">Iniciar Sesión</a>
          </Button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No hay comentarios todavía. ¡Sé el primero en comentar!
            </p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="vijaya-card p-6">
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
                        {comment.user?.username[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-vijaya-black">
                      {comment.user?.username}
                    </span>
                    <span className="text-sm text-gray-500">
                      {formatRelativeTime(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{comment.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-vijaya-green transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      <span>{comment.likes || 0}</span>
                    </button>

                    <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition-colors">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                        />
                      </svg>
                      <span>{comment.dislikes || 0}</span>
                    </button>

                    <button className="text-sm text-gray-600 hover:text-vijaya-green transition-colors">
                      Responder
                    </button>

                    {user && user.id === comment.user_id && (
                      <button className="text-sm text-gray-600 hover:text-red-500 transition-colors ml-auto">
                        Eliminar
                      </button>
                    )}
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