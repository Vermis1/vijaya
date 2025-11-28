'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AdType, AdPlacement } from '@/types';

export default function AdForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    type: 'banner' as AdType,
    code: '',
    placement: 'header' as AdPlacement,
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validations
    if (!formData.code.trim()) {
      setError('El código del anuncio es obligatorio');
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('ads')
        .insert([{
          type: formData.type,
          code: formData.code.trim(),
          placement: formData.placement,
          active: true,
        }]);

      if (insertError) throw insertError;

      // Reset form
      setFormData({
        type: 'banner',
        code: '',
        placement: 'header',
      });

      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Error al agregar el anuncio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-vijaya bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="type">Tipo de anuncio *</Label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-vijaya focus:outline-none focus:ring-2 focus:ring-vijaya-green"
            disabled={loading}
          >
            <option value="banner">Banner</option>
            <option value="sidebar">Sidebar</option>
            <option value="inline">Inline</option>
            <option value="popup">Popup</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="placement">Ubicación *</Label>
          <select
            id="placement"
            name="placement"
            value={formData.placement}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-vijaya focus:outline-none focus:ring-2 focus:ring-vijaya-green"
            disabled={loading}
          >
            <option value="header">Header</option>
            <option value="sidebar">Sidebar</option>
            <option value="article_top">Artículo (Top)</option>
            <option value="article_middle">Artículo (Medio)</option>
            <option value="article_bottom">Artículo (Abajo)</option>
            <option value="footer">Footer</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">Código del anuncio *</Label>
        <textarea
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          placeholder="Pega aquí el código HTML/JavaScript del anuncio o Google Adsense..."
          className="w-full px-4 py-3 border border-gray-300 rounded-vijaya focus:outline-none focus:ring-2 focus:ring-vijaya-green resize-none font-mono text-sm"
          rows={6}
          required
          disabled={loading}
        />
        <p className="text-xs text-gray-500">
          Puedes pegar código HTML, JavaScript o scripts de Google Adsense
        </p>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? 'Agregando...' : 'Agregar Anuncio'}
      </Button>
    </form>
  );
}