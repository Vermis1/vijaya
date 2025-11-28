'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SponsorPlacement } from '@/types';

export default function SponsorForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    logo_url: '',
    url: '',
    placement: 'sidebar' as SponsorPlacement,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    if (!formData.name.trim() || !formData.logo_url.trim() || !formData.url.trim()) {
      setError('Todos los campos son obligatorios');
      setLoading(false);
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('sponsors')
        .insert([{
          name: formData.name,
          logo_url: formData.logo_url,
          url: formData.url,
          placement: formData.placement,
          active: true,
        }]);

      if (insertError) throw insertError;

      // Reset form
      setFormData({
        name: '',
        logo_url: '',
        url: '',
        placement: 'sidebar',
      });

      router.refresh();
    } catch (error: any) {
      setError(error.message || 'Error al agregar el sponsor');
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
          <Label htmlFor="name">Nombre del Sponsor *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Empresa ABC"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="url">URL del Sponsor *</Label>
          <Input
            id="url"
            name="url"
            type="url"
            value={formData.url}
            onChange={handleChange}
            placeholder="https://ejemplo.com"
            required
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logo_url">URL del Logo *</Label>
          <Input
            id="logo_url"
            name="logo_url"
            type="url"
            value={formData.logo_url}
            onChange={handleChange}
            placeholder="https://ejemplo.com/logo.png"
            required
            disabled={loading}
          />
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
            <option value="sidebar">Sidebar</option>
            <option value="header">Header</option>
            <option value="footer">Footer</option>
            <option value="article">Artículo</option>
          </select>
        </div>
      </div>

      {formData.logo_url && (
        <div className="space-y-2">
          <Label>Preview del Logo</Label>
          <div className="w-full max-w-xs h-32 bg-gray-50 rounded-vijaya flex items-center justify-center p-4">
            <img
              src={formData.logo_url}
              alt="Preview"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? 'Agregando...' : 'Agregar Sponsor'}
      </Button>
    </form>
  );
}