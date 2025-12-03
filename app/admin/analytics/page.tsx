import { createServerSupabaseClient } from '@/lib/supabase/server';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import { formatRelativeTime } from '@/lib/utils';

async function getAnalyticsData() {
  const supabase = createServerSupabaseClient();

  // Visitas hoy
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { count: todayVisits } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'page_view')
    .gte('created_at', today.toISOString());

  // Visitas últimos 7 días
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: weekVisits } = await supabase
    .from('analytics_events')
    .select('*', { count: 'exact', head: true })
    .eq('event_type', 'page_view')
    .gte('created_at', sevenDaysAgo.toISOString());

  // Visitantes únicos (por session_id)
  const { data: uniqueVisitors } = await supabase
    .from('analytics_events')
    .select('session_id')
    .eq('event_type', 'page_view')
    .gte('created_at', sevenDaysAgo.toISOString());

  const uniqueCount = new Set(uniqueVisitors?.map(v => v.session_id)).size;

  // Páginas más visitadas
  const { data: topPages } = await supabase
    .from('analytics_events')
    .select('page_url')
    .eq('event_type', 'page_view')
    .gte('created_at', sevenDaysAgo.toISOString());

  const pageCount: Record<string, number> = {};
  topPages?.forEach(p => {
    pageCount[p.page_url] = (pageCount[p.page_url] || 0) + 1;
  });

  const topPagesArray = Object.entries(pageCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([url, count]) => ({ url, count }));

  // Países con más visitas
  const { data: topCountries } = await supabase
    .from('analytics_events')
    .select('country')
    .eq('event_type', 'page_view')
    .not('country', 'is', null)
    .gte('created_at', sevenDaysAgo.toISOString());

  const countryCount: Record<string, number> = {};
  topCountries?.forEach(c => {
    if (c.country) {
      countryCount[c.country] = (countryCount[c.country] || 0) + 1;
    }
  });

  const topCountriesArray = Object.entries(countryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([country, count]) => ({ country, count }));

  // Dispositivos
  const { data: devices } = await supabase
    .from('analytics_events')
    .select('device_type')
    .eq('event_type', 'page_view')
    .gte('created_at', sevenDaysAgo.toISOString());

  const deviceCount: Record<string, number> = {};
  devices?.forEach(d => {
    deviceCount[d.device_type] = (deviceCount[d.device_type] || 0) + 1;
  });

  // Errores recientes
  const { data: recentErrors } = await supabase
    .from('system_errors')
    .select('*')
    .eq('resolved', false)
    .order('created_at', { ascending: false })
    .limit(10);

  // Performance promedio
  const { data: perfMetrics } = await supabase
    .from('performance_metrics')
    .select('load_time, ttfb')
    .gte('created_at', sevenDaysAgo.toISOString());

  const avgLoadTime = perfMetrics?.length
    ? Math.round(perfMetrics.reduce((sum, m) => sum + (m.load_time || 0), 0) / perfMetrics.length)
    : 0;

  return {
    todayVisits: todayVisits || 0,
    weekVisits: weekVisits || 0,
    uniqueVisitors: uniqueCount,
    topPages: topPagesArray,
    topCountries: topCountriesArray,
    devices: deviceCount,
    recentErrors: recentErrors || [],
    avgLoadTime,
  };
}

export default async function AnalyticsPage() {
  const data = await getAnalyticsData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-heading font-bold text-vijaya-black mb-2">
          Analytics
        </h1>
        <p className="text-gray-600">
          Estadísticas y métricas de tu plataforma
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-vijaya-lime/30 rounded-vijaya flex items-center justify-center">
              <svg className="w-6 h-6 text-vijaya-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-vijaya-black mb-1">
            {data.todayVisits}
          </div>
          <div className="text-sm text-gray-600">Visitas Hoy</div>
        </div>

        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-vijaya flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-vijaya-black mb-1">
            {data.weekVisits}
          </div>
          <div className="text-sm text-gray-600">Visitas (7 días)</div>
        </div>

        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-vijaya flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-vijaya-black mb-1">
            {data.uniqueVisitors}
          </div>
          <div className="text-sm text-gray-600">Visitantes Únicos</div>
        </div>

        <div className="vijaya-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-vijaya flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-heading font-bold text-vijaya-black mb-1">
            {data.avgLoadTime}ms
          </div>
          <div className="text-sm text-gray-600">Tiempo de Carga</div>
        </div>
      </div>

      {/* Charts */}
      <AnalyticsCharts />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="vijaya-card p-6">
          <h2 className="text-xl font-heading font-semibold mb-6">Páginas Más Visitadas</h2>
          <div className="space-y-3">
            {data.topPages.map((page, index) => (
              <div key={page.url} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-vijaya-lime/30 rounded-full flex items-center justify-center text-vijaya-green font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="truncate text-gray-700">{page.url}</div>
                </div>
                <div className="text-vijaya-green font-semibold ml-4">{page.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Countries */}
        <div className="vijaya-card p-6">
          <h2 className="text-xl font-heading font-semibold mb-6">Países con Más Visitas</h2>
          <div className="space-y-3">
            {data.topCountries.map((country) => (
              <div key={country.country} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                <div className="text-gray-700">{country.country}</div>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-vijaya-green h-2 rounded-full"
                      style={{ width: `${(country.count / data.weekVisits) * 100}%` }}
                    />
                  </div>
                  <div className="text-vijaya-green font-semibold w-12 text-right">{country.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Devices */}
      <div className="vijaya-card p-6">
        <h2 className="text-xl font-heading font-semibold mb-6">Dispositivos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(data.devices).map(([device, count]) => (
            <div key={device} className="p-4 bg-vijaya-beige/30 rounded-vijaya">
              <div className="text-4xl mb-2">
                {device === 'mobile' && '📱'}
                {device === 'tablet' && '📲'}
                {device === 'desktop' && '💻'}
              </div>
              <div className="text-2xl font-heading font-bold text-vijaya-black">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{device}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Errors */}
      {data.recentErrors.length > 0 && (
        <div className="vijaya-card p-6">
          <h2 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Errores Recientes
          </h2>
          <div className="space-y-3">
            {data.recentErrors.map((error) => (
              <div key={error.id} className="p-4 bg-red-50 border border-red-200 rounded-vijaya">
                <div className="flex items-start justify-between mb-2">
                  <div className="font-medium text-red-900">{error.error_message}</div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    error.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    error.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {error.severity}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {error.page_url} • {formatRelativeTime(error.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}