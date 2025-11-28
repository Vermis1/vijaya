import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/types';
import { formatDate, getExcerpt } from '@/lib/utils';

interface RelatedArticlesProps {
  articles: Article[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (articles.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-vijaya-black mb-8 text-center">
          Artículos Relacionados
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  {article.tags.slice(0, 1).map((tag) => (
                    <span 
                      key={tag}
                      className="text-xs bg-vijaya-lime/30 text-vijaya-green px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-lg font-heading font-semibold text-vijaya-black mb-2 group-hover:text-vijaya-green transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {getExcerpt(article.content, 100)}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{article.author?.username}</span>
                  <span>{formatDate(article.created_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}