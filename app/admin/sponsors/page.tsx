import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Sponsor } from '@/types';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import SponsorForm from '@/components/admin/SponsorForm';
import SponsorToggle from '@/components/admin/SponsorToggle';

async function getSponsors(): Promise<Sponsor[]> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('sponsors')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sponsors:', error);
    return [];
  }

  return data || [];
}

export default async function AdminSponsorsPage() {
  const sponsors = await getSponsors();
  const activeCount = sponsors.filter(s => s.active).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-2">
            Sponsors
          </h1>
          <p className="text-gray-600">
            Gestiona los sponsors que aparecen en la plataforma
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-heading font-bold text-vijaya-green">
            {activeCount}
          </div>
          <div className="text-sm text-gray-600">Activos</div>
        </div>
      </div>

      {/* Add New Sponsor Form */}
      <div className="vijaya-card p-6">
        <h2 className="text-xl font-heading font-semibold mb-4">
          Agregar Nuevo Sponsor
        </h2>
        <SponsorForm />
      </div>

      {/* Sponsors Grid */}
      {sponsors.length === 0 ? (
        <div className="vijaya-card p-12 text-center">
          <p className="text-gray-500 mb-4">No hay sponsors agregados todavía</p>
          <p className="text-sm text-gray-400">
            Usa el formulario de arriba para agregar tu primer sponsor
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="vijaya-card p-6">
              {/* Logo */}
              <div className="relative h-32 w-full bg-gray-50 rounded-vijaya mb-4 flex items-center justify-center overflow-hidden">
                <Image
                  src={sponsor.logo_url}
                  alt={sponsor.name}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {/* Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-heading font-semibold text-lg text-vijaya-black mb-1">
                    {sponsor.name}
                  </h3>
                  <a
                    href={sponsor.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-vijaya-green hover:underline break-all"
                  >
                    {sponsor.url}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600">Ubicación:</span>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${sponsor.placement === 'sidebar' ? 'bg-blue-100 text-blue-700' : ''}
                    ${sponsor.placement === 'header' ? 'bg-purple-100 text-purple-700' : ''}
                    ${sponsor.placement === 'footer' ? 'bg-gray-100 text-gray-700' : ''}
                    ${sponsor.placement === 'article' ? 'bg-green-100 text-green-700' : ''}
                  `}>
                    {sponsor.placement === 'sidebar' && 'Sidebar'}
                    {sponsor.placement === 'header' && 'Header'}
                    {sponsor.placement === 'footer' && 'Footer'}
                    {sponsor.placement === 'article' && 'Artículo'}
                  </span>
                </div>

                <div className="text-xs text-gray-500">
                  Agregado: {formatDate(sponsor.created_at)}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <SponsorToggle sponsorId={sponsor.id} active={sponsor.active} />
                  <button className="text-sm text-red-600 hover:underline">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info Box */}
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
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-medium text-vijaya-black mb-1">
              Sobre las ubicaciones
            </h3>
            <p className="text-sm text-gray-600">
              <strong>Sidebar:</strong> Aparece en la barra lateral del blog.
              <br />
              <strong>Header:</strong> Aparece en la parte superior del sitio.
              <br />
              <strong>Footer:</strong> Aparece en el pie de página.
              <br />
              <strong>Artículo:</strong> Aparece dentro de los artículos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}