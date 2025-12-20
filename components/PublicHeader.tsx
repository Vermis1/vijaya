'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function PublicHeader() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b">
      <Link href="/" className="font-bold text-lg">
        Vijaya
      </Link>

      {!user ? (
        <Link
          href="/login"
          className="px-4 py-2 rounded bg-vijaya-olive text-white"
        >
          Iniciar sesión
        </Link>
      ) : (
        <div className="relative group">
          <img
            src={user.user_metadata?.avatar_url || '/avatar-placeholder.png'}
            className="w-9 h-9 rounded-full cursor-pointer"
          />

          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg opacity-0 group-hover:opacity-100 transition">
            <Link
              href="/admin"
              className="block px-4 py-2 hover:bg-gray-100"
            >
              Dashboard
            </Link>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                location.href = '/';
              }}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
