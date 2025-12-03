'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // Generar session ID único
    let sessionId = sessionStorage.getItem('vijaya_session');
    if (!sessionId) {
      sessionId = crypto.randomUUID();
      sessionStorage.setItem('vijaya_session', sessionId);
    }

    // Detectar información del navegador
    const getDeviceType = () => {
      const ua = navigator.userAgent;
      if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
        return 'tablet';
      }
      if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
        return 'mobile';
      }
      return 'desktop';
    };

    const getBrowser = () => {
      const ua = navigator.userAgent;
      if (ua.includes('Firefox')) return 'Firefox';
      if (ua.includes('Chrome')) return 'Chrome';
      if (ua.includes('Safari')) return 'Safari';
      if (ua.includes('Edge')) return 'Edge';
      return 'Other';
    };

    const getOS = () => {
      const ua = navigator.userAgent;
      if (ua.includes('Win')) return 'Windows';
      if (ua.includes('Mac')) return 'MacOS';
      if (ua.includes('Linux')) return 'Linux';
      if (ua.includes('Android')) return 'Android';
      if (ua.includes('iOS')) return 'iOS';
      return 'Other';
    };

    // Obtener geolocalización aproximada (usando API externa)
    const trackPageView = async () => {
      try {
        // Obtener IP y geolocalización
        const geoResponse = await fetch('https://ipapi.co/json/');
        const geoData = await geoResponse.json();

        // Obtener user_id si está logueado
        const { data: { session } } = await supabase.auth.getSession();

        // Guardar evento
        await supabase.from('analytics_events').insert({
          event_type: 'page_view',
          page_url: pathname,
          user_id: session?.user?.id || null,
          session_id: sessionId,
          ip_address: geoData.ip || null,
          country: geoData.country_name || null,
          city: geoData.city || null,
          device_type: getDeviceType(),
          browser: getBrowser(),
          os: getOS(),
          referrer: document.referrer || null,
        });

        // Medir performance
        if (window.performance) {
          const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          setTimeout(() => {
            supabase.from('performance_metrics').insert({
              page_url: pathname,
              load_time: Math.round(perfData.loadEventEnd - perfData.fetchStart),
              ttfb: Math.round(perfData.responseStart - perfData.requestStart),
              fcp: Math.round(perfData.domContentLoadedEventEnd - perfData.fetchStart),
            });
          }, 1000);
        }
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackPageView();
  }, [pathname]);

  // Capturar errores globales
  useEffect(() => {
    const handleError = async (event: ErrorEvent) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        await supabase.from('system_errors').insert({
          error_type: 'client_error',
          error_message: event.message,
          error_stack: event.error?.stack || null,
          page_url: window.location.pathname,
          user_id: session?.user?.id || null,
          user_agent: navigator.userAgent,
          severity: 'medium',
        });
      } catch (error) {
        console.error('Error logging failed:', error);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  return null;
}