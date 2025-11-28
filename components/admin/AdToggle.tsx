'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface AdToggleProps {
  adId: string;
  active: boolean;
}

export default function AdToggle({ adId, active }: AdToggleProps) {
  const router = useRouter();
  const [isActive, setIsActive] = useState(active);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('ads')
        .update({ active: !isActive })
        .eq('id', adId);

      if (error) throw error;

      setIsActive(!isActive);
      router.refresh();
    } catch (error) {
      console.error('Error toggling ad:', error);
      alert('Error al cambiar el estado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`
        relative inline-flex h-6 w-11 items-center rounded-full transition-colors
        focus:outline-none focus:ring-2 focus:ring-vijaya-green focus:ring-offset-2
        ${isActive ? 'bg-vijaya-green' : 'bg-gray-300'}
        ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
      `}
    >
      <span className="sr-only">
        {isActive ? 'Desactivar' : 'Activar'} anuncio
      </span>
      <span
        className={`
          inline-block h-4 w-4 transform rounded-full bg-white transition-transform
          ${isActive ? 'translate-x-6' : 'translate-x-1'}
        `}
      />
    </button>
  );
}   