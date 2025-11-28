'use client';

import { useEffect, useRef } from 'react';

interface ArticleContentProps {
  content: any;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !content) return;

    // Renderizar el contenido JSON de TipTap a HTML
    const renderContent = (node: any): string => {
      if (!node) return '';

      if (node.type === 'text') {
        let text = node.text || '';
        
        // Aplicar marcas (bold, italic, etc.)
        if (node.marks) {
          node.marks.forEach((mark: any) => {
            switch (mark.type) {
              case 'bold':
                text = `<strong>${text}</strong>`;
                break;
              case 'italic':
                text = `<em>${text}</em>`;
                break;
              case 'underline':
                text = `<u>${text}</u>`;
                break;
              case 'strike':
                text = `<s>${text}</s>`;
                break;
              case 'code':
                text = `<code>${text}</code>`;
                break;
              case 'link':
                text = `<a href="${mark.attrs.href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
                break;
              case 'textStyle':
                if (mark.attrs.color) {
                  text = `<span style="color: ${mark.attrs.color}">${text}</span>`;
                }
                break;
            }
          });
        }
        
        return text;
      }

      let html = '';
      const childrenHtml = node.content ? node.content.map(renderContent).join('') : '';

      switch (node.type) {
        case 'doc':
          html = childrenHtml;
          break;
        case 'paragraph':
          html = `<p>${childrenHtml || '<br>'}</p>`;
          break;
        case 'heading':
          const level = node.attrs?.level || 1;
          html = `<h${level}>${childrenHtml}</h${level}>`;
          break;
        case 'bulletList':
          html = `<ul>${childrenHtml}</ul>`;
          break;
        case 'orderedList':
          html = `<ol>${childrenHtml}</ol>`;
          break;
        case 'listItem':
          html = `<li>${childrenHtml}</li>`;
          break;
        case 'blockquote':
          html = `<blockquote>${childrenHtml}</blockquote>`;
          break;
        case 'codeBlock':
          html = `<pre><code>${childrenHtml}</code></pre>`;
          break;
        case 'horizontalRule':
          html = '<hr>';
          break;
        case 'hardBreak':
          html = '<br>';
          break;
        case 'image':
          const src = node.attrs?.src || '';
          const alt = node.attrs?.alt || '';
          const title = node.attrs?.title || '';
          html = `<img src="${src}" alt="${alt}" title="${title}" />`;
          break;
        case 'youtube':
          const videoId = node.attrs?.src?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
          if (videoId) {
            html = `<div class="video-wrapper"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`;
          }
          break;
        default:
          html = childrenHtml;
      }

      return html;
    };

    const htmlContent = renderContent(content);
    containerRef.current.innerHTML = htmlContent;
  }, [content]);

  if (!content) {
    return <p className="text-gray-500">No hay contenido disponible.</p>;
  }

  return (
    <div 
      ref={containerRef}
      className="article-content prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-vijaya-black prose-p:text-gray-700 prose-a:text-vijaya-green prose-strong:text-vijaya-black prose-blockquote:border-vijaya-green"
    />
  );
}