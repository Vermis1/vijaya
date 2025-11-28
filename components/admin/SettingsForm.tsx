'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SiteConfig } from '@/types';

interface SettingsFormProps {
  config: SiteConfig;
}

export default function SettingsForm({ config }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    site_name: config.site_name || 'Vijaya',
    site_description: config.site_description || '',
    logo_url: config.logo_url || '',
    favicon_url: config.favicon_url || '',
    primary_color: config.primary_color || '#3E8C67',
    secondary_color: config.secondary_color || '#B5DDA5',
    instagram: config.social_links?.instagram || '',
    facebook: config.social_links?.facebook || '',
    twitter: config.social_links?.twitter || '',
    youtube: config.social_links?.youtube || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from('site_config')
        .update({
          site_name: formData.site_name,
          site_description: formData.site_description,
          logo_url: formData.logo_url || null,
          favicon_url: formData.favicon_url || null,
          primary_color: formData.primary_color,
          secondary_color: formData.secondary_color,
          social_links: {
            instagram: formData.instagram || null,
            facebook: formData.facebook || null,
            twitter: formData.twitter || null,
            youtube: formData.youtube || null,
          },
          updated_at: new Date().toISOString(),
        })
        .eq('id', config.id);

      if (updateError) throw updateError;

      setSuccess(true);
      router.refresh();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      setError(error.message || 'Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 rounded-vijaya bg-red-50 border border-red-200 text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-vijaya bg-green-50 border border-green-200 text-green-700">
          ✓ Configuración guardada exitosamente
        </div>
      )}

      {/* General Settings */}
      <div className="vijaya-card p-6 space-y-4">
        <h2 className="text-xl font-heading font-semibold text-vijaya-black mb-4">
          Información General
        </h2>

        <div className="space-y-2">
          <Label htmlFor="site_name">Nombre del sitio</Label>
          <Input
            id="site_name"
            name="site_name"
            value={formData.site_name}
            onChange={handleChange}
            placeholder="Vijaya"
            disabled={loading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="site_description">Descripción del sitio</Label>
          <textarea
            id="site_description"
            name="site_description"
            value={formData.site_description}
            onChange={handleChange}
            placeholder="Plataforma moderna de contenido sobre cannabis..."
            className="w-full px-4 py-3 border border-gray-300 rounded-vijaya focus:outline-none focus:ring-2 focus:ring-vijaya-green resize-none"
            rows={3}
            disabled={loading}
          />
        </div>
      </div>

      {/* Branding */}
      <div className="vijaya-card p-6 space-y-4">
        <h2 className="text-xl font-heading font-semibold text-vijaya-black mb-4">
          Marca Visual
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="logo_url">URL del Logo</Label>
            <Input
              id="logo_url"
              name="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/logo.png"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="favicon_url">URL del Favicon</Label>
            <Input
              id="favicon_url"
              name="favicon_url"
              type="url"
              value={formData.favicon_url}
              onChange={handleChange}
              placeholder="https://ejemplo.com/favicon.ico"
              disabled={loading}
            />
          </div>
        </div>

        {/* Logo Preview */}
        {formData.logo_url && (
          <div className="space-y-2">
            <Label>Preview del Logo</Label>
            <div className="w-48 h-24 bg-gray-50 rounded-vijaya flex items-center justify-center p-4">
              <img
                src={formData.logo_url}
                alt="Logo preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* Colors */}
      <div className="vijaya-card p-6 space-y-4">
        <h2 className="text-xl font-heading font-semibold text-vijaya-black mb-4">
          Colores
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_color">Color Primario</Label>
            <div className="flex gap-2">
              <Input
                id="primary_color"
                name="primary_color"
                type="color"
                value={formData.primary_color}
                onChange={handleChange}
                className="w-20 h-10 p-1 cursor-pointer"
                disabled={loading}
              />
              <Input
                type="text"
                value={formData.primary_color}
                onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                placeholder="#3E8C67"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondary_color">Color Secundario</Label>
            <div className="flex gap-2">
              <Input
                id="secondary_color"
                name="secondary_color"
                type="color"
                value={formData.secondary_color}
                onChange={handleChange}
                className="w-20 h-10 p-1 cursor-pointer"
                disabled={loading}
              />
              <Input
                type="text"
                value={formData.secondary_color}
                onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                placeholder="#B5DDA5"
                disabled={loading}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="vijaya-card p-6 space-y-4">
        <h2 className="text-xl font-heading font-semibold text-vijaya-black mb-4">
          Redes Sociales
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              name="instagram"
              type="url"
              value={formData.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/vijaya"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              name="facebook"
              type="url"
              value={formData.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/vijaya"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter / X</Label>
            <Input
              id="twitter"
              name="twitter"
              type="url"
              value={formData.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/vijaya"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube">YouTube</Label>
            <Input
              id="youtube"
              name="youtube"
              type="url"
              value={formData.youtube}
              onChange={handleChange}
              placeholder="https://youtube.com/@vijaya"
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="vijaya-card p-6">
        <div className="flex items-center gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.refresh()}
            disabled={loading}
          >
            Cancelar
          </Button>
        </div>
      </div>
    </form>
  );
}