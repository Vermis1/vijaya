export function WebsiteJsonLd() {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Vijaya',
      description: 'Cultivo orgánico de cannabis y comunidad',
      url: 'https://vijaya.uy',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://vijaya.uy/blog?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  }
  
  export function OrganizationJsonLd() {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Vijaya',
      description: 'Plataforma de cultivo orgánico de cannabis',
      url: 'https://vijaya.uy',
      logo: 'https://vijaya.uy/logo.png',
      sameAs: [
        'https://facebook.com/vijaya',
        'https://instagram.com/vijaya',
        'https://twitter.com/vijaya',
      ],
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  }
  
  export function ArticleJsonLd({ article }: { article: any }) {
    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      image: article.cover_image,
      author: {
        '@type': 'Person',
        name: article.author?.username,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Vijaya',
        logo: {
          '@type': 'ImageObject',
          url: 'https://vijaya.uy/logo.png',
        },
      },
      datePublished: article.created_at,
      dateModified: article.updated_at,
    };
  
    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    );
  }