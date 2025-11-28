import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SiteConfig } from '@/types';
import SettingsForm from '@/components/admin/SettingsForm';

async function getSiteConfig(): Promise<SiteConfig | null> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('site_config')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching site config:', error);
    return null;
  }

  return data;
}

export default async function AdminSettingsPage() {
  const config = await getSiteConfig();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-2">
          Configuración del Sitio
        </h1>
        <p className="text-gray-600">
          Personaliza la apariencia y configuración general de Vijaya
        </p>
      </div>

      {/* Settings Form */}
      {config ? (
        <SettingsForm config={config} />
      ) : (
        <div className="vijaya-card p-12 text-center">
          <p className="text-gray-500 mb-4">No se pudo cargar la configuración</p>
          <p className="text-sm text-gray-400">
            Verifica que la tabla site_config esté correctamente inicializada
          </p>
        </div>
      )}

      {/* Info Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Colors Info */}
        <div className="vijaya-card p-6 bg-vijaya-lime/10 border-2 border-vijaya-lime">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-vijaya-green"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-vijaya-black mb-2">
                Paleta de Colores
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                Los colores actuales de Vijaya:
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-vijaya-green"></div>
                  <span>Verde Cannabis: #3E8C67</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-vijaya-lime"></div>
                  <span>Verde Lima: #B5DDA5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Logo Info */}
        <div className="vijaya-card p-6 bg-blue-50 border-2 border-blue-200">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-vijaya-black mb-2">
                Logo y Favicon
              </h3>
              <p className="text-sm text-gray-600">
                Sube tus imágenes a un servicio de hosting (como Cloudinary, Imgur, o Supabase Storage) 
                y pega las URLs en el formulario.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Status */}
      <div className="vijaya-card p-6">
        <h2 className="text-xl font-heading font-semibold mb-4">
          Estado de Funcionalidades
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-vijaya">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-green-900">Activo</span>
            </div>
            <p className="text-sm text-green-700">Blog y Artículos</p>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-vijaya">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-green-900">Activo</span>
            </div>
            <p className="text-sm text-green-700">Comentarios</p>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-vijaya">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-green-900">Activo</span>
            </div>
            <p className="text-sm text-green-700">Panel Admin</p>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-vijaya">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-yellow-900">Próximamente</span>
            </div>
            <p className="text-sm text-yellow-700">Tienda</p>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-vijaya">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-green-900">Activo</span>
            </div>
            <p className="text-sm text-green-700">Sponsors & Ads</p>
          </div>

          <div className="p-4 bg-green-50 border border-green-200 rounded-vijaya">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium text-green-900">Activo</span>
            </div>
            <p className="text-sm text-green-700">Roles de Usuario</p>
          </div>
        </div>
      </div>
    </div>
  );
}