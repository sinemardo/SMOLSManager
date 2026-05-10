import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

async function getData() {
  try {
    const [cats, prods] = await Promise.all([
      axios.get(API + '/categories'),
      axios.get(API + '/products')
    ]);
    return {
      categories: cats.data.categories || [],
      products: prods.data.products || prods.data || []
    };
  } catch {
    return { categories: [], products: [] };
  }
}

export default async function Home() {
  const { categories, products } = await getData();

  return (
    <main className="min-h-screen bg-gray-50">
      <div style={{background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff'}}>
        <div style={{maxWidth: '1280px', margin: '0 auto', padding: '64px 16px'}}>
          <h1 style={{fontSize: '48px', fontWeight: 700, marginBottom: '16px'}}>SMOLSManager</h1>
          <p style={{fontSize: '20px', opacity: 0.9}}>Social Media OnLine Shop Management</p>
          <p style={{marginTop: '16px', opacity: 0.75}}>Descubre productos de vendedores en redes sociales</p>
        </div>
      </div>

      <div style={{maxWidth: '1280px', margin: '0 auto', padding: '32px 16px'}}>
        <h2 style={{fontSize: '24px', fontWeight: 700, marginBottom: '16px'}}>Categorias</h2>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px'}}>
          {categories.map((cat: any) => (
            <span key={cat.id} style={{padding: '8px 16px', borderRadius: '9999px', fontSize: '14px', backgroundColor: '#eef2ff', color: '#4338ca'}}>
              {cat.displayName}
            </span>
          ))}
        </div>

        <h2 style={{fontSize: '24px', fontWeight: 700, marginBottom: '16px'}}>Productos</h2>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px'}}>
          {products.map((p: any) => (
            <div key={p.id} style={{backgroundColor: '#fff', borderRadius: '12px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
              <h3 style={{fontWeight: 600, fontSize: '18px'}}>{p.name}</h3>
              <p style={{color: '#6b7280', fontSize: '14px', marginTop: '4px'}}>{p.description?.substring(0, 100)}</p>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px'}}>
                <span style={{fontSize: '20px', fontWeight: 700, color: '#4f46e5'}}>€{p.price}</span>
                <span style={{fontSize: '12px', color: '#9ca3af'}}>{p.seller?.storeName}</span>
              </div>
              <span style={{display: 'inline-block', marginTop: '8px', padding: '2px 8px', backgroundColor: '#eef2ff', borderRadius: '4px', fontSize: '12px'}}>
                {p.category?.displayName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
