import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Article } from '@/types';
import { formatDate, getExcerpt, getReadingTime } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog - Vijaya',
  description: 'Explora nuestros artículos sobre cannabis, cultura y comunidad',
};

export const revalidate = 60;

async function getArticles(): Promise<Article[]> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:users(id, username, avatar_url)
    `)
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    return [];
  }

  return data || [];
}

async function getSponsors() {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .from('sponsors')
    .select('*')
    .eq('active', true)
    .eq('placement', 'sidebar')
    .limit(3);

  return data || [];
}

export default async function BlogPage() {
  const articles = await getArticles();
  const sponsors = await getSponsors();

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
              <Link href="/blog" className="text-vijaya-olive font-semibold">
                Blog
              </Link>
              <Link href="/tienda" className="text-gray-600 hover:text-vijaya-olive transition-colors font-medium">
                Tienda
              </Link>
              <Link href="/login" className="text-gray-600 hover:text-vijaya-olive transition-colors font-medium">
                Iniciar Sesión
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-vijaya-olive py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="text-9xl absolute top-5 right-10"><img src="img/logo.png" alt="Vijaya" className="w-full" /></div>
          <div className="text-7xl absolute bottom-5 left-10"></div>
        </div>
        <div className="vijaya-container relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-white mb-4">
              Blog
            </h1>
            <p className="text-xl text-white/90">
              Artículos, guías y contenido experto sobre cultivo orgánico y cannabis
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="vijaya-container">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Articles Grid */}
            <div className="flex-1">
              {/* Search/Filter Bar */}
              <div className="mb-12 space-y-4">
                <input
                  type="search"
                  placeholder="Buscar artículos..."
                  className="w-full px-6 py-4 rounded-vijaya border-2 border-gray-200 focus:outline-none focus:border-vijaya-olive transition-colors bg-white"
                />
                <div className="flex flex-wrap gap-3">
                  {['Todos', 'Cultivo', 'Salud', 'CBD', 'Recetas', 'Noticias'].map((tag) => (
                    <button
                      key={tag}
                      className="px-5 py-2.5 bg-white border-2 border-gray-200 rounded-full text-sm font-medium hover:border-vijaya-olive hover:text-vijaya-olive transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Articles */}
              {articles.length === 0 ? (
                <div className="text-center py-20 vijaya-card">
                  <div className="text-8xl mb-6 opacity-20">📝</div>
                  <p className="text-gray-500 text-lg">No hay artículos disponibles.</p>
                </div>
              ) : (
                <div className="space-y-8">
                  {articles.map((article) => (
                    <Link 
                      key={article.id}
                      href={`/article/${article.slug}`}
                      className="group"
                    >
                      <article className="vijaya-card overflow-hidden">
                        <div className="md:flex gap-6">
                          {article.cover_image && (
                            <div className="md:w-80 h-64 md:h-auto relative overflow-hidden bg-vijaya-beige flex-shrink-0">
                              <img
                                src={article.cover_image}
                                alt={article.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                          )}
                          <div className="p-6 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                              {article.tags.slice(0, 3).map((tag) => (
                                <span 
                                  key={tag}
                                  className="text-xs bg-vijaya-beige text-vijaya-olive px-3 py-1.5 rounded-full font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <h2 className="text-3xl font-heading font-semibold text-vijaya-black mb-3 group-hover:text-vijaya-olive transition-colors">
                              {article.title}
                            </h2>
                            <p className="text-gray-600 mb-6 line-clamp-2 flex-1">
                              {getExcerpt(article.content, 180)}
                            </p>
                            <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-3">
                                {article.author?.avatar_url ? (
                                  <img
                                    src={article.author.avatar_url}
                                    alt={article.author.username}
                                    className="w-8 h-8 rounded-full"
                                  />
                                ) : (
                                  <div className="w-8 h-8 bg-vijaya-olive rounded-full flex items-center justify-center text-white text-sm">
                                    {article.author?.username[0].toUpperCase()}
                                  </div>
                                )}
                                <span className="font-medium">{article.author?.username}</span>
                              </div>
                              <div className="flex items-center gap-4">
                                <span>{getReadingTime(article.content)} min</span>
                                <span>•</span>
                                <span>{formatDate(article.created_at)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 space-y-8">
              {/* Newsletter */}
              <div className="vijaya-card p-8 bg-vijaya-beige/50">
                <div className="text-4xl mb-4">📬</div>
                <h3 className="text-xl font-heading font-semibold mb-2">Newsletter</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Recibe las últimas noticias y artículos
                </p>
                <input
                  type="email"
                  placeholder="Tu email"
                  className="w-full px-4 py-3 rounded-vijaya border-2 border-gray-200 mb-4 focus:outline-none focus:border-vijaya-olive"
                />
                <button className="w-full vijaya-btn text-sm">
                  Suscribirme
                </button>
              </div>

              {/* Sponsors */}
              {sponsors.length > 0 && (
                <div className="vijaya-card p-6">
                  <h3 className="text-lg font-heading font-semibold mb-6">Sponsors</h3>
                  <div className="space-y-4">
                    {sponsors.map((sponsor) => (
                      <a
                        key={sponsor.id}
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 bg-vijaya-beige/30 rounded-vijaya hover:shadow-vijaya transition-all"
                      >
                        <img
                          src={sponsor.logo_url}
                          alt={sponsor.name}
                          className="w-full h-auto"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Tags */}
              <div className="vijaya-card p-6">
                <h3 className="text-lg font-heading font-semibold mb-6">Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {['Cultivo', 'Salud', 'CBD', 'Recetas', 'Noticias', 'Guías', 'Orgánico', 'Tips'].map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-vijaya-beige text-vijaya-olive rounded-full text-sm font-medium cursor-pointer hover:bg-vijaya-olive hover:text-white transition-all"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-vijaya-black text-white py-16 mt-20">
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