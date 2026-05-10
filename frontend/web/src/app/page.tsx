'use client';

import { useEffect, useState } from 'react';
import { getCategories, getProducts } from '@/services/api';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    getCategories().then(r => setCategories(r.data.categories));
    loadProducts('');
  }, []);

  const loadProducts = (cat: string) => {
    setSelectedCategory(cat);
    getProducts(cat ? { category: cat } : {}).then(r => setProducts(r.data.products || []));
  };

  const handleAddToCart = (product: any) => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0]?.url || '',
      quantity: 1
    });
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Hero */}
      <header style={{ background: 'linear-gradient(135deg, #1e1b4b, #312e81, #4f46e5)', color: '#fff', padding: '60px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 52px)', fontWeight: 800, marginBottom: 12 }}>SMOLSManager</h1>
        <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', opacity: 0.9, maxWidth: 600, margin: '0 auto' }}>
          Descubre productos de vendedores en Instagram, TikTok y Facebook
        </p>
      </header>

      {/* Categories */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 16px' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 20, textAlign: 'center' }}>Categorías</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
          <button
            onClick={() => loadProducts('')}
            style={{
              padding: '10px 20px', borderRadius: 25, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              background: !selectedCategory ? '#4f46e5' : '#fff', color: !selectedCategory ? '#fff' : '#6b7280',
              boxShadow: !selectedCategory ? '0 4px 12px rgba(79,70,229,0.3)' : '0 1px 3px rgba(0,0,0,0.06)'
            }}
          >
            Todas
          </button>
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              onClick={() => loadProducts(cat.id)}
              style={{
                padding: '10px 20px', borderRadius: 25, border: 'none', fontSize: 14, fontWeight: 500, cursor: 'pointer',
                background: selectedCategory === cat.id ? '#4f46e5' : '#fff',
                color: selectedCategory === cat.id ? '#fff' : '#6b7280',
                boxShadow: selectedCategory === cat.id ? '0 4px 12px rgba(79,70,229,0.3)' : '0 1px 3px rgba(0,0,0,0.06)'
              }}
            >
              {cat.displayName}
            </button>
          ))}
        </div>

        {/* Products */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {products.map((p: any) => (
            <div key={p.id} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s, box-shadow 0.2s' }}>
              <Link href={'/product/' + p.id}>
                <div style={{ height: 200, background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 56 }}>📦</span>
                </div>
              </Link>
              <div style={{ padding: 20 }}>
                <Link href={'/product/' + p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{p.name}</h3>
                  <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 8, lineHeight: 1.4 }}>
                    {p.description?.substring(0, 80)}{p.description?.length > 80 ? '...' : ''}
                  </p>
                </Link>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: '#4f46e5' }}>€{p.price}</span>
                  <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                    {p.category?.displayName}
                  </span>
                </div>
                <button
                  onClick={() => handleAddToCart(p)}
                  style={{
                    width: '100%', marginTop: 12, padding: '10px', background: '#4f46e5', color: '#fff',
                    border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  🛒 Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ background: '#1f2937', color: '#9ca3af', padding: '40px 16px', textAlign: 'center', fontSize: 14, marginTop: 60 }}>
        <p style={{ fontWeight: 600, color: '#fff', marginBottom: 8 }}>SMOLSManager</p>
        <p>Social Media OnLine Shop Management © 2026</p>
      </footer>
    </main>
  );
}
