'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export default function AnalyticsCharts() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    try {
      // Obtener visitas de los últimos 7 días
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data } = await supabase
        .from('analytics_events')
        .select('created_at')
        .eq('event_type', 'page_view')
        .gte('created_at', sevenDaysAgo.toISOString())
        .order('created_at', { ascending: true });

      // Agrupar por día
      const dayCount: Record<string, number> = {};
      data?.forEach(event => {
        const date = new Date(event.created_at).toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        });
        dayCount[date] = (dayCount[date] || 0) + 1;
      });

      const chartArray = Object.entries(dayCount).map(([date, count]) => ({
        date,
        visitas: count,
      }));

      setChartData(chartArray);
    } catch (error) {
      console.error('Error loading chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="vijaya-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const maxVisits = Math.max(...chartData.map(d => d.visitas), 1);

  return (
    <div className="vijaya-card p-6">
      <h2 className="text-xl font-heading font-semibold mb-6">Visitas de los Últimos 7 Días</h2>
      
      {/* Gráfica de barras simple */}
      <div className="space-y-4">
        {chartData.map((day) => (
          <div key={day.date} className="flex items-center gap-4">
            <div className="w-24 text-sm text-gray-600 font-medium">{day.date}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-vijaya-green to-vijaya-lime h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3"
                    style={{ width: `${(day.visitas / maxVisits) * 100}%` }}
                  >
                    <span className="text-white font-semibold text-sm">{day.visitas}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {chartData.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay datos para mostrar todavía
        </div>
      )}
    </div>
  );
}