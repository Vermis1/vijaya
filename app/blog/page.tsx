import { createServerSupabaseClient } from '@/lib/supabase/server';

export const revalidate = 0; // No cache

async function getArticles() {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('articles')
    .select('id, title, slug, status')
    .eq('status', 'published');

  return { data, error };
}

export default async function BlogPage() {
  const { data, error } = await getArticles();

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>BLOG - TEST ULTRA SIMPLE</h1>
      
      <div style={{ background: '#f0f0f0', padding: '10px', margin: '10px 0' }}>
        <h2>DEBUG INFO:</h2>
        <p>Error: {error ? JSON.stringify(error) : 'null'}</p>
        <p>Data: {data ? `Array con ${data.length} artículos` : 'null'}</p>
      </div>

      {error && (
        <div style={{ background: '#ffcccc', padding: '10px' }}>
          <h2>ERROR:</h2>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {data && data.length === 0 && (
        <div style={{ background: '#ffffcc', padding: '10px' }}>
          <p>La query funcionó pero retornó 0 artículos</p>
        </div>
      )}

      {data && data.length > 0 && (
        <div>
          <h2>ARTÍCULOS ENCONTRADOS: {data.length}</h2>
          {data.map((article: any) => (
            <div key={article.id} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
              <h3>{article.title}</h3>
              <p>Slug: {article.slug}</p>
              <p>Status: {article.status}</p>
              <p>ID: {article.id}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}   