'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { User, UserRole } from '@/types';

interface UserRoleSelectProps {
  user: User;
}

export default function UserRoleSelect({ user }: UserRoleSelectProps) {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>(user.role);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === role) return;

    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', user.id);

      if (error) throw error;

      setRole(newRole);
      router.refresh();
    } catch (error) {
      console.error('Error updating role:', error);
      alert('Error al actualizar el rol');
    } finally {
      setLoading(false);
    }
  };

  const roleColors: Record<UserRole, string> = {
    admin: 'bg-purple-100 text-purple-700',
    editor: 'bg-blue-100 text-blue-700',
    journalist: 'bg-green-100 text-green-700',
    author: 'bg-yellow-100 text-yellow-700',
    user: 'bg-gray-100 text-gray-700',
  };

  const roleLabels: Record<UserRole, string> = {
    admin: 'Admin',
    editor: 'Editor',
    journalist: 'Periodista',
    author: 'Autor',
    user: 'Usuario',
  };

  return (
    <select
      value={role}
      onChange={(e) => handleRoleChange(e.target.value as UserRole)}
      disabled={loading}
      className={`
        px-3 py-1 rounded-full text-xs font-medium cursor-pointer
        transition-all focus:outline-none focus:ring-2 focus:ring-vijaya-green
        ${roleColors[role]}
        ${loading ? 'opacity-50 cursor-wait' : ''}
      `}
    >
      <option value="user">{roleLabels.user}</option>
      <option value="author">{roleLabels.author}</option>
      <option value="journalist">{roleLabels.journalist}</option>
      <option value="editor">{roleLabels.editor}</option>
      <option value="admin">{roleLabels.admin}</option>
    </select>
  );
}