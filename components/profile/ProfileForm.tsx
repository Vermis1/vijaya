'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types';
import { validateUsername } from '@/lib/utils';

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    username: user.username,
    avatar_url: user.avatar_url || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    // Validations
    if (!validateUsername(formData.username)) {
      setError('El nombre de usuario debe tener entre 3-20 caracteres y solo letras, números y guion bajo');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabase
        .from('users')
        .update({
          username: formData.username,
          avatar_url: formData.avatar_url || null,
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setSuccess(true);
      router.refresh();
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      setError(error.message || 'Error al actualizar el perfil');
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
          ✓ Perfil actualizado exitosamente
        </div>
      )}

      <div className="vijaya-card p-6 space-y-4">
        <h2 className="text-xl font-heading font-semibold text-vijaya-black mb-4">
          Editar Perfil
        </h2>

        <div className="space-y-2">
          <Label htmlFor="username">Nombre de usuario</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="usuario123"
            required
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            3-20 caracteres, solo letras, números y guion bajo
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="avatar_url">URL del Avatar</Label>
          <Input
            id="avatar_url"
            name="avatar_url"
            type="url"
            value={formData.avatar_url}
            onChange={handleChange}
            placeholder="https://ejemplo.com/avatar.jpg"
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            URL de tu imagen de perfil
          </p>
        </div>

        {formData.avatar_url && (
          <div className="space-y-2">
            <Label>Preview del Avatar</Label>
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center">
              <img
                src={formData.avatar_url}
                alt="Avatar preview"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            value={user.email}
            disabled
            className="bg-gray-100 cursor-not-allowed"
          />
          <p className="text-xs text-gray-500">
            El email no se puede cambiar
          </p>
        </div>

        <div className="flex items-center gap-4 pt-4">
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