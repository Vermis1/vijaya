'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClientSupabaseClient } from '@/lib/supabase/client';

export default function PublicHeader() {
  const supabase = createClientSupabaseClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Obtener sesión + perfil
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);

      if (sessionUser) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, role, avatar_url')
          .eq('id', sessionUser.id)
          .single();

        setProfile(profileData);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Cerrar dropdown al clickear afuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setOpen(false);
    window.location.href = '/';
  }

  const isAdmin = profile?.role === 'admin' || profile?.role === 'editor';
  const initial = profile?.full_name?.charAt(0)?.toUpperCase() ?? 'U';

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="vijaya-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-vijaya-olive rounded-full flex items-center justify-center">
              <img src="/img/logo.png" alt="Vijaya" className="w-full" />
            </div>
            <div className="text-2xl font-heading font-semibold text-vijaya-black">
              Vijaya
            </div>
          </Link>

          {/* Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/blog" className="text-gray-600 hover:text-vijaya-olive font-medium">
              Blog
            </Link>
            <Link href="/tienda" className="text-gray-600 hover:text-vijaya-olive font-medium">
              Tienda
            </Link>

            {!user && (
              <>
                <Link href="/login" className="text-gray-600 hover:text-vijaya-olive font-medium">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="vijaya-btn text-sm">
                  Comenzar
                </Link>
              </>
            )}

            {user && (
              <div className="relative" ref={dropdownRef}>
                {/* Avatar */}
                <button
                  onClick={() => setOpen((v) => !v)}
                  className="w-10 h-10 rounded-full bg-vijaya-olive text-white font-semibold flex items-center justify-center"
                >
                  {initial}
                </button>

                <AnimatePresence>
                  {open && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {profile?.full_name ?? 'Usuario'}
                        </p>
                      </div>

                      <div className="flex flex-col">
                        <Link
                          href={isAdmin ? '/admin' : '/profile'}
                          onClick={() => setOpen(false)}
                          className="px-4 py-3 text-sm hover:bg-gray-50"
                        >
                          Dashboard
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="px-4 py-3 text-sm text-red-600 hover:bg-red-50 text-left"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
