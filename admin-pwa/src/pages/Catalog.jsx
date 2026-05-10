import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function Catalog() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({ category: '', search: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  // 1. Cargar categorías primero
  useEffect(() => {
    api.get('/categories').then(r => {
      const cats = r.data.categories || [];
      setCategories(cats);
      
      // 2. Después de tener categorías, leer URL y establecer filtro
      const urlParams = new URLSearchParams(window.location.search);
      const catFromUrl = urlParams.get('category');
      if (catFromUrl && cats.length > 0) {
        const found = cats.find(c => 
          c.id === catFromUrl || 
          c.name === catFromUrl || 
          c.displayName === catFromUrl ||
          c.name.toLowerCase() === catFromUrl.toLowerCase() ||
          c.displayName.toLowerCase() === catFromUrl.toLowerCase()
        );
        if (found) {
          console.log('Categoría encontrada en URL:', found.displayName, found.id);
          setFilter(prev => ({ ...prev, category: found.id }));
        }
      }
    });
  }, []);

  // 3. Cargar productos cuando cambia el filtro
  useEffect(() => {
    if (categories.length > 0) {
      loadProducts();
    }
  }, [filter.category, filter.search]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.category) params.category = filter.category;
      if (filter.search) params.search = filter.search;
      const res = await api.get('/products', { params });
      setProducts(res.data.products || []);
    } catch (err) {
      setMessage('Error');
    } finally { setLoading(false); }
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    setFilter({ ...filter, category: catId });
    if (catId) {
      const cat = categories.find(c => c.id === catId);
      window.history.pushState({}, '', '/catalog?category=' + (cat?.name || catId));
    } else {
      window.history.pushState({}, '', '/catalog');
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('¿Desactivar este producto?')) return;
    try {
      await api.delete('/products/' + id);
      setProducts(products.filter(p => p.id !== id));
      setMessage('Producto desactivado');
    } catch (err) { setMessage('Error al desactivar'); }
  };

  const selectedCategory = categories.find(c => c.id === filter.category);

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>📦 Catálogo de Productos</h2>
            <p style={{ color: '#6b7280', fontSize: 14 }}>
              {products.length} productos
              {selectedCategory && <span style={{ marginLeft: 8, background: '#eef2ff', color: '#4f46e5', padding: '2px 10px', borderRadius: 20, fontSize: 12 }}>{selectedCategory.displayName}</span>}
            </p>
          </div>
          <a href="/import" style={{ padding: '10px 20px', background: '#4f46e5', color: '#fff', textDecoration: 'none', borderRadius: 10, fontWeight: 600, fontSize: 14 }}>
            + Nuevo Producto
          </a>
        </div>

        <div style={{ background: '#fff', padding: 16, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <input type="text" placeholder="🔍 Buscar..." value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            style={{ flex: 1, minWidth: 200, padding: '10px 16px', border: '2px solid #e5e7eb', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
          <select value={filter.category} onChange={handleCategoryChange}
            style={{ padding: '10px 16px', border: '2px solid #4f46e5', borderRadius: 10, fontSize: 14, outline: 'none', minWidth: 180, background: '#eef2ff', color: '#4f46e5', fontWeight: 600, cursor: 'pointer', boxSizing: 'border-box' }}>
            <option value="">Todas las categorías</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.displayName} ({c._count?.products || 0})</option>)}
          </select>
          {filter.category && (
            <button onClick={() => { setFilter({ ...filter, category: '' }); window.history.pushState({}, '', '/catalog'); }}
              style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}>✕ Limpiar</button>
          )}
        </div>

        {message && <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, background: '#ecfdf5', color: '#059669', fontSize: 14, cursor: 'pointer' }} onClick={() => setMessage('')}>{message}</div>}

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {[1,2,3,4].map(i => <div key={i} style={{ background: '#fff', borderRadius: 16, height: 200, animation: 'pulse 1.5s infinite' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            <AnimatePresence>
              {products.map((product, i) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.03 }}
                  onClick={() => navigate('/catalog/' + product.id)}
                  style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
                >
                  <div style={{ height: 140, background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <span style={{ fontSize: 48 }}>📦</span>
                    <span style={{ position: 'absolute', top: 10, right: 10, background: product.isActive ? '#ecfdf5' : '#fef2f2', color: product.isActive ? '#059669' : '#dc2626', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{product.name}</h3>
                    <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.description || 'Sin descripción'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: '#4f46e5' }}>€{product.price}</span>
                      <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{product.category?.displayName || 'Sin categoría'}</span>
                    </div>
                    <button onClick={(e) => handleDelete(product.id, e)} style={{ marginTop: 12, width: '100%', padding: '8px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>🗑️ Desactivar</button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {products.length === 0 && !loading && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60 }}>
                <span style={{ fontSize: 64 }}>📦</span>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginTop: 16 }}>No hay productos</h3>
                <p style={{ color: '#6b7280', marginTop: 4 }}>{filter.category ? 'No hay productos en esta categoría' : 'Crea tu primer producto'}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
