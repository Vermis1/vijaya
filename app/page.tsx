import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Article } from '@/types';
import { formatDate, getExcerpt } from '@/lib/utils';
import Image from 'next/image';

async function getFeaturedArticles(): Promise<Article[]> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:users(id, username, avatar_url)
    `)
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
    <div className="min-h-screen">
      {/* Header/Nav placeholder */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-3xl font-heading font-bold text-vijaya-green">
                Vijaya
              </div>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/blog" className="text-gray-700 hover:text-vijaya-green transition-colors">
                Blog
              </Link>
              <Link href="/tienda" className="text-gray-700 hover:text-vijaya-green transition-colors">
                Tienda
              </Link>
              <Link href="/login" className="text-gray-700 hover:text-vijaya-green transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/register" className="vijaya-btn text-sm">
                Registrarse
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-vijaya-green to-vijaya-lime py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 animate-fade-in">
            Cultura Cannabis
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            Contenido de calidad sobre cannabis, cultura y comunidad
          </p>
          <Link 
            href="/blog" 
            className="inline-block bg-white text-vijaya-green px-8 py-4 rounded-vijaya font-medium hover:shadow-vijaya-hover transition-all duration-300"
          >
            Explorar Artículos
          </Link>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold text-vijaya-black mb-12 text-center">
            Últimos Artículos
          </h2>
          
          {articles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No hay artículos publicados todavía.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link 
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="vijaya-card group"
                >
                  {article.cover_image && (
                    <div className="relative h-48 w-full overflow-hidden rounded-t-vijaya">
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
                    <h3 className="text-xl font-heading font-semibold text-vijaya-black mb-3 group-hover:text-vijaya-green transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {getExcerpt(article.content, 120)}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{article.author?.username}</span>
                      <span>{formatDate(article.created_at)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer placeholder */}
      <footer className="bg-vijaya-black text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="text-2xl font-heading font-bold mb-4">Vijaya</div>
          <p className="text-white/70">© 2024 Vijaya. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}