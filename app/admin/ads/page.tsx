import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Ad } from '@/types';
import { formatDate } from '@/lib/utils';
import AdForm from '@/components/admin/AdForm';
import AdToggle from '@/components/admin/AdToggle';

async function getAds(): Promise<Ad[]> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('ads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching ads:', error);
    return [];
  }

  return data || [];
}

export default async function AdminAdsPage() {
  const ads = await getAds();
  const activeCount = ads.filter(a => a.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-2">
            Anuncios
          </h1>
          <p className="text-gray-600">
            Gestiona los anuncios y espacios publicitarios
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-heading font-bold text-vijaya-green">
            {activeCount}
          </div>
          <div className="text-sm text-gray-600">Activos</div>
        </div>
      </div>

      {/* Add New Ad Form */}
      <div className="vijaya-card p-6">
        <h2 className="text-xl font-heading font-semibold mb-4">
          Agregar Nuevo Anuncio
        </h2>
        <AdForm />
      </div>

      {/* Ads List */}
      {ads.length === 0 ? (
        <div className="vijaya-card p-12 text-center">
          <p className="text-gray-500 mb-4">No hay anuncios agregados todavía</p>
          <p className="text-sm text-gray-400">
            Usa el formulario de arriba para agregar tu primer anuncio
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {ads.map((ad) => (
            <div key={ad.id} className="vijaya-card p-6">
              <div className="flex items-start justify-between gap-6">
                {/* Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${ad.type === 'banner' ? 'bg-blue-100 text-blue-700' : ''}
                      ${ad.type === 'sidebar' ? 'bg-purple-100 text-purple-700' : ''}
                      ${ad.type === 'inline' ? 'bg-green-100 text-green-700' : ''}
                      ${ad.type === 'popup' ? 'bg-red-100 text-red-700' : ''}
                    `}>
                      {ad.type === 'banner' && 'Banner'}
                      {ad.type === 'sidebar' && 'Sidebar'}
                      {ad.type === 'inline' && 'Inline'}
                      {ad.type === 'popup' && 'Popup'}
                    </span>
                    
                    <span className={`
                      px-3 py-1 rounded-full text-xs font-medium
                      ${ad.placement === 'header' ? 'bg-indigo-100 text-indigo-700' : ''}
                      ${ad.placement === 'sidebar' ? 'bg-cyan-100 text-cyan-700' : ''}
                      ${ad.placement === 'article_top' ? 'bg-emerald-100 text-emerald-700' : ''}
                      ${ad.placement === 'article_middle' ? 'bg-lime-100 text-lime-700' : ''}
                      ${ad.placement === 'article_bottom' ? 'bg-amber-100 text-amber-700' : ''}
                      ${ad.placement === 'footer' ? 'bg-stone-100 text-stone-700' : ''}
                    `}>
                      {ad.placement === 'header' && 'Header'}
                      {ad.placement === 'sidebar' && 'Sidebar'}
                      {ad.placement === 'article_top' && 'Artículo (Top)'}
                      {ad.placement === 'article_middle' && 'Artículo (Medio)'}
                      {ad.placement === 'article_bottom' && 'Artículo (Abajo)'}
                      {ad.placement === 'footer' && 'Footer'}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-vijaya">
                    <div className="text-xs text-gray-500 mb-2">Código del anuncio:</div>
                    <code className="text-xs text-gray-700 break-all">
                      {ad.code.substring(0, 150)}
                      {ad.code.length > 150 && '...'}
                    </code>
                  </div>

                  <div className="text-xs text-gray-500">
                    Agregado: {formatDate(ad.created_at)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-3">
                  <AdToggle adId={ad.id} active={ad.active} />
                  <button className="text-sm text-vijaya-green hover:underline">
                    Editar
                  </button>
                  <button className="text-sm text-red-600 hover:underline">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Types Info */}
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-vijaya-black mb-2">
                Tipos de anuncios
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Banner:</strong> Anuncio horizontal grande.
                <br />
                <strong>Sidebar:</strong> Anuncio vertical en la barra lateral.
                <br />
                <strong>Inline:</strong> Anuncio dentro del contenido.
                <br />
                <strong>Popup:</strong> Anuncio emergente.
              </p>
            </div>
          </div>
        </div>

        {/* Google Adsense Info */}
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-vijaya-black mb-2">
                Google Adsense
              </h3>
              <p className="text-sm text-gray-600">
                Puedes insertar código de Google Adsense directamente en el campo "Código del anuncio". 
                El script se renderizará automáticamente en la ubicación seleccionada.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}