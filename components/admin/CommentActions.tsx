'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface CommentActionsProps {
  commentId: string;
  reported: boolean;
}

export default function CommentActions({ commentId, reported }: CommentActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm('¿Aprobar este comentario y quitar el reporte?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .update({ reported: false })
        .eq('id', commentId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al aprobar el comentario');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de eliminar este comentario? Esta acción no se puede deshacer.')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      router.refresh();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el comentario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 ml-auto">
      {reported && (
        <button
          onClick={handleApprove}
          disabled={loading}
          className="text-sm text-green-600 hover:underline disabled:opacity-50"
        >
          Aprobar
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-sm text-red-600 hover:underline disabled:opacity-50"
      >
        {loading ? 'Eliminando...' : 'Eliminar'}
      </button>
    </div>
  );
}