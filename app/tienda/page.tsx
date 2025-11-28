import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tienda - Próximamente - Vijaya',
  description: 'La tienda de Vijaya estará disponible próximamente',
};

export default function TiendaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-vijaya-beige via-white to-vijaya-lime/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-heading font-bold text-vijaya-green">
              Vijaya
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/blog" className="text-gray-700 hover:text-vijaya-green transition-colors">
                Blog
              </Link>
              <Link href="/tienda" className="text-vijaya-green font-medium">
                Tienda
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-vijaya-green transition-colors">
                Iniciar Sesión
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Coming Soon Section */}
      <section className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-20">
        <div className="text-center max-w-3xl animate-fade-in">
          {/* Icon/Illustration */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-vijaya-green/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-vijaya-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              {/* Animated circles */}
              <div className="absolute inset-0 animate-ping opacity-20">
                <div className="w-32 h-32 bg-vijaya-green rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-vijaya-black mb-6">
            Próximamente
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Estamos trabajando en algo especial para ti
          </p>

          {/* Description */}
          <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto">
            Nuestra tienda estará disponible muy pronto con productos de calidad, 
            accesorios únicos y todo lo que necesitas para disfrutar de la cultura cannabis.
          </p>

          {/* Newsletter */}
          <div className="vijaya-card p-8 max-w-md mx-auto mb-8">
            <h3 className="text-xl font-heading font-semibold mb-3">
              Sé el primero en enterarte
            </h3>
            <p className="text-gray-600 mb-6">
              Regístrate y te notificaremos cuando la tienda esté lista
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-4 py-3 rounded-vijaya border border-gray-300 focus:outline-none focus:ring-2 focus:ring-vijaya-green"
              />
              <button
                type="submit"
                className="w-full vijaya-btn"
              >
                Notificarme
              </button>
            </form>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="vijaya-card p-6">
              <div className="w-12 h-12 bg-vijaya-lime/30 rounded-vijaya flex items-center justify-center mb-4 mx-auto">
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h4 className="font-heading font-semibold mb-2">Calidad Premium</h4>
              <p className="text-sm text-gray-600">
                Solo los mejores productos seleccionados
              </p>
            </div>

            <div className="vijaya-card p-6">
              <div className="w-12 h-12 bg-vijaya-lime/30 rounded-vijaya flex items-center justify-center mb-4 mx-auto">
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="font-heading font-semibold mb-2">Envío Rápido</h4>
              <p className="text-sm text-gray-600">
                Entrega segura y discreta
              </p>
            </div>

            <div className="vijaya-card p-6">
              <div className="w-12 h-12 bg-vijaya-lime/30 rounded-vijaya flex items-center justify-center mb-4 mx-auto">
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
              <h4 className="font-heading font-semibold mb-2">Mejores Precios</h4>
              <p className="text-sm text-gray-600">
                Ofertas exclusivas para la comunidad
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-12">
            <Link 
              href="/"
              className="inline-flex items-center text-vijaya-green hover:underline"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Volver al inicio
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-vijaya-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-heading font-bold mb-4">Vijaya</div>
          <p className="text-white/70">© 2024 Vijaya. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}