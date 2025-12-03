import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada - Vijaya',
  description: 'La página que buscas no existe',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-vijaya-cream bg-texture flex items-center justify-center px-6 py-20">
      <div className="text-center max-w-2xl animate-fade-in">
        {/* Ilustración 404 */}
        <div className="mb-12 relative">
          <div className="text-[180px] md:text-[240px] font-heading font-bold text-vijaya-beige leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-8xl md:text-9xl illustration-float">
              🌿
            </div>
          </div>
        </div>

        {/* Contenido */}
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-vijaya-black mb-6">
          Esta página se perdió en el cultivo
        </h1>
        
        <p className="text-xl text-gray-600 mb-12 leading-relaxed">
          Lo sentimos, la página que buscas no existe o fue movida a otro lugar.
        </p>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/"
            className="vijaya-btn inline-flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Volver al inicio
          </Link>
          
          <Link 
            href="/blog"
            className="vijaya-btn-outline inline-flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Explorar el blog
          </Link>
        </div>

        {/* Enlaces adicionales */}
        <div className="mt-16 pt-8 border-t-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-4">¿Necesitas ayuda?</p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <Link href="/blog" className="text-vijaya-olive hover:text-vijaya-green transition-colors font-medium">
              Blog
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/tienda" className="text-vijaya-olive hover:text-vijaya-green transition-colors font-medium">
              Tienda
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/login" className="text-vijaya-olive hover:text-vijaya-green transition-colors font-medium">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}