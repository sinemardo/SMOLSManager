import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

async function getData() {
  try {
    const [cats, prods] = await Promise.all([
      axios.get(API + '/categories'),
      axios.get(API + '/products?limit=50')
    ]);
    return {
      categories: cats.data.categories || [],
      products: prods.data.products || []
    };
  } catch {
    return { categories: [], products: [] };
  }
}

export default async function Home() {
  const { categories, products } = await getData();

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4f46e5)', color: '#fff', padding: '60px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 800, marginBottom: 12, letterSpacing: '-1px' }}>SMOLSManager</h1>
        <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', opacity: 0.9, maxWidth: 600, margin: '0 auto' }}>Social Media OnLine Shop · Descubre productos de vendedores en redes sociales</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 32, flexWrap: 'wrap' }}>
          {['instagram', 'tiktok', 'facebook'].map(p => (
            <span key={p} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '8px 20px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}>
              {p === 'instagram' ? '📷' : p === 'tiktok' ? '🎵' : '📘'} {p}
            </span>
          ))}
        </div>
      </header>

      {/* Categories */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 16px' }}>
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Categorias</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 40 }}>
          {categories.map((cat: any) => (
            <span key={cat.id} style={{ background: '#fff', padding: '12px 24px', borderRadius: 30, fontSize: 14, fontWeight: 500, color: '#4f46e5', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'all 0.2s' }}>
              {cat.displayName}
            </span>
          ))}
        </div>

        {/* Products */}
        <h2 style={{ fontSize: 'clamp(20px, 3vw, 28px)', fontWeight: 700, marginBottom: 24, textAlign: 'center' }}>Productos Destacados</h2>
        
        {products.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
            <p style={{ fontSize: 18 }}>No hay productos disponibles aun</p>
            <p style={{ fontSize: 14, marginTop: 8 }}>Los vendedores estan preparando su catalogo</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {products.map((p: any) => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}>
              {/* Imagen */}
              <div style={{ height: 200, background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <span style={{ fontSize: 56 }}>📦</span>
                {p.socialPlatform && (
                  <span style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, backdropFilter: 'blur(4px)' }}>
                    {p.socialPlatform === 'instagram' ? '📷' : p.socialPlatform === 'tiktok' ? '🎵' : '📘'}
                  </span>
                )}
              </div>
              {/* Info */}
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, margin: 0, flex: 1 }}>{p.name}</h3>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#4f46e5', whiteSpace: 'nowrap' }}>€{p.price}</span>
                </div>
                <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 12, lineHeight: 1.5 }}>{p.description?.substring(0, 120)}{p.description?.length > 120 ? '...' : ''}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{p.category?.displayName}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>por {p.seller?.storeName || p.seller?.name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1f2937', color: '#9ca3af', padding: '40px 16px', textAlign: 'center', fontSize: 14 }}>
        <p style={{ fontWeight: 600, color: '#fff', marginBottom: 8 }}>SMOLSManager</p>
        <p>Social Media OnLine Shop Management © 2026</p>
        <p style={{ marginTop: 16 }}>smolsmanager.com</p>
      </footer>
    </main>
  );
}
