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


export const revalidate = 300;

interface Props {
  params: {
    slug: string;
  };
}

async function getArticle(slug: string): Promise<Article | null> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
  .from('articles')
  .select('*')
  .eq('slug', slug)
  .eq('status', 'published')
  .single();

if (error || !data) {
  return null;
}


  await supabase.rpc('increment_article_views', { article_id: data.id });

  return data;
}

async function getRelatedArticles(articleId: string, tags: string[]): Promise<Article[]> {
  const supabase = createServerSupabaseClient();
  
  const { data } = await supabase
  .from('articles')
  .select('*')
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

  const articleUrl = `https://www.vijaya.uy/article/${article.slug}`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(article.title);

  return (
    <div className="min-h-screen bg-vijaya-cream">
      
      {/* Article Header */}
      <article className="py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-vijaya-olive transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-vijaya-olive transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-vijaya-olive font-medium">{article.title}</span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-6">
            {article.tags.map((tag) => (
              <span 
                key={tag}
                className="text-sm bg-vijaya-beige text-vijaya-olive px-4 py-2 rounded-full font-medium"
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
          <div className="flex items-center gap-6 mb-12 pb-8 border-b-2 border-gray-100">
            <div className="flex items-center gap-4">
              {article.author?.avatar_url ? (
                <img
                  src={article.author.avatar_url}
                  alt={article.author.username}
                  className="w-14 h-14 rounded-full"
                />
              ) : (
                <div className="w-14 h-14 bg-vijaya-olive rounded-full flex items-center justify-center text-white text-xl font-bold">
                  {article.author?.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-vijaya-black text-lg">{article.author?.username}</div>
                <div className="text-sm text-gray-600">
                  {formatDate(article.created_at)} • {getReadingTime(article.content)} min de lectura
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          {article.cover_image && (
            <div className="relative w-full h-[400px] md:h-[500px] rounded-vijaya-soft overflow-hidden mb-16 shadow-vijaya">
              <img
                src={article.cover_image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-16 text-gray-700 leading-relaxed">
            <ArticleContent content={article.content} />
          </div>

{/* Share Buttons */}
<div className="flex items-center gap-4 py-8 border-y-2 border-gray-100 mb-16">
  <span className="text-gray-600 font-semibold">Compartir:</span>

  <a
    href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-6 py-3 bg-vijaya-beige text-vijaya-olive rounded-full hover:bg-vijaya-olive hover:text-white transition-all font-medium"
  >
    Twitter
  </a>

  <a
    href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-6 py-3 bg-vijaya-beige text-vijaya-olive rounded-full hover:bg-vijaya-olive hover:text-white transition-all font-medium"
  >
    Facebook
  </a>

  <a
    href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
    target="_blank"
    rel="noopener noreferrer"
    className="px-6 py-3 bg-vijaya-beige text-vijaya-olive rounded-full hover:bg-vijaya-olive hover:text-white transition-all font-medium"
  >
    WhatsApp
  </a>
</div>


          {/* Author Bio */}
          <div className="vijaya-card p-8 mb-16">
            <div className="flex items-start gap-6">
              {article.author?.avatar_url ? (
                <img
                  src={article.author.avatar_url}
                  alt={article.author.username}
                  className="w-20 h-20 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-20 h-20 bg-vijaya-olive rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {article.author?.username[0].toUpperCase()}
                </div>
              )}
              <div>
                <h3 className="text-2xl font-heading font-semibold mb-2 text-vijaya-black">
                  {article.author?.username}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Escritor apasionado por la cultura del cannabis y el cultivo orgánico.
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