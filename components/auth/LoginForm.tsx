'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Login con Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        throw signInError;
      }

      if (!data.session) {
        throw new Error('No se pudo crear la sesión');
      }

      // 2. Verificar que el usuario existe en la tabla users
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      // 3. Si no existe el perfil, crearlo
      if (profileError || !userProfile) {
        console.log('Creando perfil de usuario...');
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          username: data.user.email?.split('@')[0] || 'user',
          role: 'user',
        });

        if (insertError) {
          console.error('Error al crear perfil:', insertError);
        }
      }

      // 4. Esperar un momento para que se sincronice todo
      await new Promise(resolve => setTimeout(resolve, 500));

      // 5. Recargar para actualizar la sesión en el servidor
      router.refresh();

      // 6. Redirigir según el rol
      if (userProfile?.role === 'admin' || userProfile?.role === 'editor') {
        router.push('/admin');
      } else {
        router.push('/profile');
      }

      // 7. Forzar recarga de la página
      window.location.href = userProfile?.role === 'admin' || userProfile?.role === 'editor' 
        ? '/admin' 
        : '/profile';

    } catch (error: any) {
      console.error('Error en login:', error);
      setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
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

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          autoComplete="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          autoComplete="current-password"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </Button>
    </form>
  );
}