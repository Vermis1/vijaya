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

export const revalidate = 60; // ISR: revalidar cada 60 segundos

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
    <div className="min-h-screen bg-vijaya-beige">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-3xl font-heading font-bold text-vijaya-green">
              Vijaya
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/blog" className="text-vijaya-green font-medium">
                Blog
              </Link>
              <Link href="/tienda" className="text-gray-700 hover:text-vijaya-green transition-colors">
                Tienda
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-vijaya-green transition-colors">
                Iniciar Sesión
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-vijaya-green to-vijaya-lime py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-heading font-bold text-white mb-4">
            Blog
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Artículos, noticias y contenido de calidad sobre cannabis y cultura
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Articles Grid */}
            <div className="flex-1">
              {/* Search/Filter Bar */}
              <div className="mb-8 flex flex-col sm:flex-row gap-4">
                <input
                  type="search"
                  placeholder="Buscar artículos..."
                  className="flex-1 px-4 py-3 rounded-vijaya border border-gray-300 focus:outline-none focus:ring-2 focus:ring-vijaya-green"
                />
                <select className="px-4 py-3 rounded-vijaya border border-gray-300 focus:outline-none focus:ring-2 focus:ring-vijaya-green">
                  <option>Todos los temas</option>
                  <option>Cultivo</option>
                  <option>Salud</option>
                  <option>Cultura</option>
                  <option>Noticias</option>
                </select>
              </div>

              {/* Articles */}
              {articles.length === 0 ? (
                <div className="text-center py-12 vijaya-card">
                  <p className="text-gray-500 text-lg">No hay artículos disponibles.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {articles.map((article) => (
                    <Link 
                      key={article.id}
                      href={`/article/${article.slug}`}
                      className="vijaya-card group"
                    >
                      {article.cover_image && (
                        <div className="relative h-52 w-full overflow-hidden rounded-t-vijaya">
                          <Image
                            src={article.cover_image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                          {article.tags.slice(0, 2).map((tag) => (
                            <span 
                              key={tag}
                              className="text-xs bg-vijaya-lime/30 text-vijaya-green px-3 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <h2 className="text-2xl font-heading font-semibold text-vijaya-black mb-3 group-hover:text-vijaya-green transition-colors">
                          {article.title}
                        </h2>
                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {getExcerpt(article.content, 150)}
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            {article.author?.avatar_url && (
                              <Image
                                src={article.author.avatar_url}
                                alt={article.author.username}
                                width={24}
                                height={24}
                                className="rounded-full"
                              />
                            )}
                            <span>{article.author?.username}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span>{getReadingTime(article.content)} min</span>
                            <span>•</span>
                            <span>{formatDate(article.created_at)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <aside className="lg:w-80 space-y-6">
              {/* Sponsors */}
              {sponsors.length > 0 && (
                <div className="vijaya-card p-6">
                  <h3 className="text-lg font-heading font-semibold mb-4">Sponsors</h3>
                  <div className="space-y-4">
                    {sponsors.map((sponsor) => (
                      <a
                        key={sponsor.id}
                        href={sponsor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 border border-gray-200 rounded-vijaya hover:shadow-vijaya transition-all"
                      >
                        <Image
                          src={sponsor.logo_url}
                          alt={sponsor.name}
                          width={200}
                          height={80}
                          className="w-full h-auto"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter */}
              <div className="vijaya-card p-6">
                <h3 className="text-lg font-heading font-semibold mb-2">Newsletter</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Recibe las últimas noticias y artículos en tu correo
                </p>
                <input
                  type="email"
                  placeholder="Tu email"
                  className="w-full px-4 py-2 rounded-vijaya border border-gray-300 mb-3 focus:outline-none focus:ring-2 focus:ring-vijaya-green"
                />
                <button className="w-full vijaya-btn text-sm">
                  Suscribirme
                </button>
              </div>

              {/* Popular Tags */}
              <div className="vijaya-card p-6">
                <h3 className="text-lg font-heading font-semibold mb-4">Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {['Cultivo', 'Salud', 'CBD', 'Recetas', 'Noticias', 'Cultura'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-vijaya-lime/20 text-vijaya-green rounded-full text-sm cursor-pointer hover:bg-vijaya-lime/40 transition-colors"
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
      <footer className="bg-vijaya-black text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-heading font-bold mb-4">Vijaya</div>
          <p className="text-white/70">© 2024 Vijaya. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}