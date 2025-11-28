import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Article } from '@/types';
import { formatDate, getReadingTime, getExcerpt } from '@/lib/utils';
import ArticleContent from '@/components/article/ArticleContent';
import CommentSection from '@/components/article/CommentSection';
import RelatedArticles from '@/components/article/RelatedArticles';

export const revalidate = 300; // ISR: revalidar cada 5 minutos

interface Props {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string): Promise<Article | null> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:users(id, username, avatar_url)
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Error fetching article:', error);
    return null;
  }

  // Incrementar views
  await supabase.rpc('increment_article_views', { article_id: data.id });

  return data;
}

async function getRelatedArticles(articleId: string, tags: string[]): Promise<Article[]> {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
    .from('articles')
    .select(`
      *,
      author:users(id, username, avatar_url)
    `)
    .eq('status', 'published')
    .neq('id', articleId)
    .overlaps('tags', tags)
    .limit(3);

  return data || [];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle(params.slug);

  if (!article) {
    return {
      title: 'Artículo no encontrado - Vijaya',
    };
  }

  return {
    title: `${article.title} - Vijaya`,
    description: getExcerpt(article.content, 160),
    openGraph: {
      title: article.title,
      description: getExcerpt(article.content, 160),
      images: article.cover_image ? [article.cover_image] : [],
      type: 'article',
      publishedTime: article.created_at,
      authors: [article.author?.username || 'Vijaya'],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.id, article.tags);

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
              <Link href="/blog" className="text-gray-700 hover:text-vijaya-green transition-colors">
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

      {/* Article Header */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-vijaya-green">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-vijaya-green">Blog</Link>
            <span>/</span>
            <span className="text-vijaya-green">{article.title}</span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-6">
            {article.tags.map((tag) => (
              <span 
                key={tag}
                className="text-sm bg-vijaya-lime/30 text-vijaya-green px-4 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-heading font-bold text-vijaya-black mb-6 leading-tight">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {article.author?.avatar_url && (
                <Image
                  src={article.author.avatar_url}
                  alt={article.author.username}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <div className="font-medium text-vijaya-black">{article.author?.username}</div>
                <div className="text-sm text-gray-600">
                  {formatDate(article.created_at)} • {getReadingTime(article.content)} min de lectura
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {article.cover_image && (
            <div className="relative w-full h-[400px] md:h-[500px] rounded-vijaya overflow-hidden mb-12">
              <Image
                src={article.cover_image}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-16">
            <ArticleContent content={article.content} />
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-4 py-8 border-y border-gray-200 mb-12">
            <span className="text-gray-600 font-medium">Compartir:</span>
            <button className="px-4 py-2 bg-vijaya-green/10 text-vijaya-green rounded-vijaya hover:bg-vijaya-green/20 transition-colors">
              Twitter
            </button>
            <button className="px-4 py-2 bg-vijaya-green/10 text-vijaya-green rounded-vijaya hover:bg-vijaya-green/20 transition-colors">
              Facebook
            </button>
            <button className="px-4 py-2 bg-vijaya-green/10 text-vijaya-green rounded-vijaya hover:bg-vijaya-green/20 transition-colors">
              WhatsApp
            </button>
          </div>

          {/* Author Bio */}
          <div className="vijaya-card p-8 mb-12">
            <div className="flex items-start gap-4">
              {article.author?.avatar_url && (
                <Image
                  src={article.author.avatar_url}
                  alt={article.author.username}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              )}
              <div>
                <h3 className="text-xl font-heading font-semibold mb-2">
                  Sobre {article.author?.username}
                </h3>
                <p className="text-gray-600">
                  Escritor apasionado por la cultura del cannabis y el contenido de calidad.
                </p>
              </div>
            </div>
          </div>

          {/* Comments */}
          <CommentSection articleId={article.id} />
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <RelatedArticles articles={relatedArticles} />
      )}

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