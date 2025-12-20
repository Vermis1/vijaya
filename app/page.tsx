import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Article } from '@/types';
import { formatDate, getExcerpt } from '@/lib/utils';

async function getFeaturedArticles(): Promise<Article[]> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6);

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data || [];
}

export default async function HomePage() {
  const articles = await getFeaturedArticles();

  return (
    <div className="min-h-screen bg-vijaya-cream">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
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
              <Link href="/tienda" className="text-gray-600 hover:text-vijaya-olive transition-colors font-medium">
                Tienda
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-vijaya-olive transition-colors font-medium">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="vijaya-btn text-sm">
                Comenzar
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section - Minimalista */}
      <section className="vijaya-section bg-texture relative overflow-hidden">
        <div className="vijaya-container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Texto */}
            <div className="space-y-8 animate-fade-in">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-vijaya-black leading-tight">
                Cultiva conocimiento<br />
                <span className="text-vijaya-olive">orgánico</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                En Vijaya creemos en nutrir plantas de forma natural. Descubre contenido experto sobre cannabis, cultivo orgánico y comunidad.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/blog" className="vijaya-btn">
                  Explorar Blog
                </Link>
                <Link href="/tienda" className="vijaya-btn-outline">
                  Ver Productos
                </Link>
              </div>
            </div>

            {/* Ilustración (placeholder para tu logo/ilustración) */}
            <div className="relative hidden lg:block illustration-float">
  <div className="w-full aspect-square bg-vijaya-beige/30 rounded-full flex items-center justify-center p-12">
    <img 
      src="/img/logo.png" 
      alt="Vijaya" 
      className="w-full h-full object-contain"
    />
  </div>
</div>
          </div>
        </div>
      </section>

      {/* Últimos Artículos */}
      <section className="vijaya-section bg-white">
        <div className="vijaya-container">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-vijaya-black">
              Últimas Publicaciones
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Contenido fresco sobre cultivo, salud y comunidad cannabis
            </p>
          </div>
          
          {articles.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg mb-6">Pronto compartiremos contenido contigo</p>
              <div className="text-8xl opacity-20"><img src="img/logo.png" alt="Vijaya" className="w-full" /></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link 
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="group"
                >
                  <article className="vijaya-card overflow-hidden h-full flex flex-col">
                    {article.cover_image && (
                      <div className="relative h-56 w-full overflow-hidden bg-vijaya-beige">
                        <img
                          src={article.cover_image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        {article.tags.slice(0, 2).map((tag) => (
                          <span 
                            key={tag}
                            className="text-xs bg-vijaya-beige text-vijaya-olive px-3 py-1.5 rounded-full font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-heading font-semibold text-vijaya-black mb-3 group-hover:text-vijaya-olive transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                        {getExcerpt(article.content, 120)}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                        <span className="font-medium">{article.author?.username}</span>
                        <span>{formatDate(article.created_at)}</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="vijaya-section bg-vijaya-olive relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl"><img src="img/logo.png" alt="Vijaya" className="w-full" /></div>
          <div className="absolute bottom-10 right-10 text-8xl"><img src="img/logo.png" alt="Vijaya" className="w-full" /></div>
        </div>
        <div className="vijaya-container relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white">
              Únete a la comunidad
            </h2>
            <p className="text-xl text-white/90 leading-relaxed">
              Forma parte de una comunidad que cultiva conocimiento y comparte experiencias
            </p>
            <Link href="/register" className="inline-block bg-white text-vijaya-olive px-10 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              Crear cuenta gratis
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
              <p className="text-white/70">
                Cultivando conocimiento orgánico
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Navegación</h4>
              <ul className="space-y-2 text-white/70">
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/tienda" className="hover:text-white transition-colors">Tienda</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Iniciar Sesión</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Comunidad</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
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