import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Tienda - Próximamente - Vijaya',
  description: 'La tienda de Vijaya estará disponible próximamente',
};

export default function TiendaPage() {
  return (
    <div className="min-h-screen bg-vijaya-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="vijaya-container">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-vijaya-olive rounded-full flex items-center justify-center">
                <span className="text-white text-2xl"><img src="img/logo.png" alt="Vijaya" className="w-full" /></span>
              </div>
              <div className="text-2xl font-heading font-semibold text-vijaya-black">
                Vijaya
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/blog" className="text-gray-600 hover:text-vijaya-olive transition-colors font-medium">
                Blog
              </Link>
              <Link href="/tienda" className="text-vijaya-olive font-semibold">
                Tienda
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-vijaya-olive transition-colors font-medium">
                Iniciar Sesión
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Coming Soon Section */}
      <section className="flex items-center justify-center min-h-[calc(100vh-200px)] px-6 py-20 bg-texture">
        <div className="text-center max-w-3xl animate-fade-in">
          {/* Illustration */}
          <div className="mb-12 flex justify-center">
            <div className="relative illustration-float">
              <div className="w-48 h-48 bg-vijaya-beige rounded-full flex items-center justify-center">
                <span className="text-9xl"><img src="img/logo.png" alt="Vijaya" className="w-full" /></span>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-vijaya-olive/20 rounded-full animate-ping"></div>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl md:text-7xl font-heading font-bold text-vijaya-black mb-6">
            Próximamente
          </h1>

          {/* Subtitle */}
          <p className="text-2xl md:text-3xl text-gray-600 mb-8 font-heading">
            Estamos cultivando algo especial
          </p>

          {/* Description */}
          <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Nuestra tienda estará disponible muy pronto con fertilizantes orgánicos, 
            accesorios de cultivo y todo lo necesario para tus plantas.
          </p>

          {/* Newsletter */}
          <div className="vijaya-card p-8 max-w-md mx-auto mb-12 bg-white">
            <h3 className="text-2xl font-heading font-semibold mb-3 text-vijaya-black">
              Sé el primero en saberlo
            </h3>
            <p className="text-gray-600 mb-6">
              Te notificaremos cuando la tienda esté lista
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Tu correo electrónico"
                className="w-full px-6 py-4 rounded-vijaya border-2 border-gray-200 focus:outline-none focus:border-vijaya-olive transition-colors"
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
            <div className="vijaya-card p-8 bg-white">
              <div className="text-5xl mb-4">🌱</div>
              <h4 className="font-heading font-semibold text-lg mb-2 text-vijaya-black">100% Orgánico</h4>
              <p className="text-sm text-gray-600">
                Productos naturales de máxima calidad
              </p>
            </div>

            <div className="vijaya-card p-8 bg-white">
              <div className="text-5xl mb-4">🚚</div>
              <h4 className="font-heading font-semibold text-lg mb-2 text-vijaya-black">Envío Rápido</h4>
              <p className="text-sm text-gray-600">
                Entrega segura a todo el país
              </p>
            </div>

            <div className="vijaya-card p-8 bg-white">
              <div className="text-5xl mb-4">💚</div>
              <h4 className="font-heading font-semibold text-lg mb-2 text-vijaya-black">Sostenible</h4>
              <p className="text-sm text-gray-600">
                Comprometidos con el planeta
              </p>
            </div>
          </div>

          {/* Back Link */}
          <div className="mt-12">
            <Link 
              href="/"
              className="inline-flex items-center text-vijaya-olive hover:text-vijaya-green transition-colors font-medium"
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
      <footer className="bg-vijaya-black text-white py-16">
        <div className="vijaya-container">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-vijaya-olive rounded-full flex items-center justify-center">
                  <span className="text-white text-xl"><img src="img/logo.png" alt="Vijaya" className="w-full" /></span>
                </div>
                <div className="text-2xl font-heading font-semibold">Vijaya</div>
              </div>
              <p className="text-white/70">Cultivando conocimiento orgánico</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navegación</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/tienda" className="hover:text-white transition-colors">Tienda</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Comunidad</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 text-center text-white/50">
            © 2024 Vijaya. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}