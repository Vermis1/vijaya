import { createServerSupabaseClient } from '@/lib/supabase/server';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import UserRoleSelect from '@/components/admin/UserRoleSelect';

async function getUsers(): Promise<User[]> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data || [];
}

async function getUserStats() {
  const supabase = createServerSupabaseClient();

  const users = await getUsers();

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    editors: users.filter(u => u.role === 'editor').length,
    authors: users.filter(u => u.role === 'author' || u.role === 'journalist').length,
    users: users.filter(u => u.role === 'user').length,
  };

  return stats;
}

export default async function AdminUsersPage() {
  const users = await getUsers();
  const stats = await getUserStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-2">
          Usuarios
        </h1>
        <p className="text-gray-600">
          Gestiona los usuarios y sus roles en la plataforma
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="vijaya-card p-4 text-center">
          <div className="text-3xl font-heading font-bold text-vijaya-green mb-1">
            {stats.total}
          </div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="vijaya-card p-4 text-center">
          <div className="text-3xl font-heading font-bold text-vijaya-green mb-1">
            {stats.admins}
          </div>
          <div className="text-sm text-gray-600">Admins</div>
        </div>
        <div className="vijaya-card p-4 text-center">
          <div className="text-3xl font-heading font-bold text-vijaya-green mb-1">
            {stats.editors}
          </div>
          <div className="text-sm text-gray-600">Editores</div>
        </div>
        <div className="vijaya-card p-4 text-center">
          <div className="text-3xl font-heading font-bold text-vijaya-green mb-1">
            {stats.authors}
          </div>
          <div className="text-sm text-gray-600">Autores</div>
        </div>
        <div className="vijaya-card p-4 text-center">
          <div className="text-3xl font-heading font-bold text-vijaya-green mb-1">
            {stats.users}
          </div>
          <div className="text-sm text-gray-600">Usuarios</div>
        </div>
      </div>

      {/* Search */}
      <div className="vijaya-card p-6">
        <input
          type="search"
          placeholder="Buscar usuarios por nombre o email..."
          className="w-full px-4 py-2 border border-gray-300 rounded-vijaya focus:outline-none focus:ring-2 focus:ring-vijaya-green"
        />
      </div>

      {/* Users Table */}
      <div className="vijaya-card overflow-hidden">
        {users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">No hay usuarios registrados</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Rol
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                    Fecha de registro
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar_url ? (
                          <Image
                            src={user.avatar_url}
                            alt={user.username}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-vijaya-lime/30 rounded-full flex items-center justify-center">
                            <span className="text-vijaya-green font-heading font-bold">
                              {user.username[0].toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-vijaya-black">
                            {user.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <UserRoleSelect user={user} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700">
                        {formatDate(user.created_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="text-sm text-vijaya-green hover:underline">
                          Ver perfil
                        </button>
                        <button className="text-sm text-red-600 hover:underline">
                          Suspender
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}