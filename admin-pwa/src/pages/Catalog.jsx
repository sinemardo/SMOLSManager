import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({ category: '', search: '', status: 'active' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    loadProducts();
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, [filter]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filter.category) params.category = filter.category;
      if (filter.search) params.search = filter.search;
      const res = await api.get('/products', { params });
      setProducts(res.data.products || []);
    } catch (err) {
      setMessage('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Desactivar este producto?')) return;
    try {
      await api.delete('/products/' + id);
      setProducts(products.filter(p => p.id !== id));
      setMessage('Producto desactivado');
    } catch (err) {
      setMessage('Error al desactivar');
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await api.put('/products/' + id, { isActive: !currentStatus });
      setProducts(products.map(p => p.id === id ? { ...p, isActive: !currentStatus } : p));
      setMessage(currentStatus ? 'Producto desactivado' : 'Producto activado');
    } catch (err) {
      setMessage('Error al cambiar estado');
    }
  };

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        {/* Cabecera */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>📦 Catálogo de Productos</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginTop: 4 }}>{products.length} productos</p>
          </div>
          <a
            href="/import"
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: 600,
              fontSize: 14,
              boxShadow: '0 5px 15px rgba(79,70,229,0.3)'
            }}
          >
            + Nuevo Producto
          </a>
        </div>

        {/* Filtros */}
        <div className="card" style={{ marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="🔍 Buscar productos..."
            value={filter.search}
            onChange={e => setFilter({ ...filter, search: e.target.value })}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '10px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
          <select
            value={filter.category}
            onChange={e => setFilter({ ...filter, category: e.target.value })}
            style={{
              padding: '10px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: 'var(--radius-md)',
              fontSize: 14,
              outline: 'none',
              minWidth: 150
            }}
          >
            <option value="">Todas las categorías</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.displayName}</option>
            ))}
          </select>
        </div>

        {/* Mensajes */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 16,
              background: message.includes('Error') ? 'var(--color-error-bg)' : 'var(--color-success-bg)',
              color: message.includes('Error') ? 'var(--color-error)' : 'var(--color-success)',
              fontSize: 14
            }}
            onClick={() => setMessage('')}
          >
            {message}
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {[1,2,3,4].map(i => (
              <div key={i} className="card" style={{ height: 200 }}>
                <div style={{ height: 120, background: '#e5e7eb', borderRadius: 'var(--radius-md)', animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: 16, width: '70%', background: '#e5e7eb', borderRadius: 4, marginTop: 12, animation: 'pulse 1.5s infinite' }} />
                <div style={{ height: 14, width: '40%', background: '#e5e7eb', borderRadius: 4, marginTop: 8, animation: 'pulse 1.5s infinite' }} />
              </div>
            ))}
          </div>
        )}

        {/* Grid de productos */}
        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            <AnimatePresence>
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: i * 0.05 }}
                  className="card"
                  style={{ padding: 0, overflow: 'hidden' }}
                >
                  {/* Imagen placeholder */}
                  <div style={{
                    height: 140,
                    background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <span style={{ fontSize: 48 }}>📦</span>
                    <span
                      className="badge"
                      style={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        background: product.isActive ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                        color: product.isActive ? 'var(--color-success)' : 'var(--color-error)'
                      }}
                    >
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{product.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {product.description || 'Sin descripción'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary)' }}>€{product.price}</span>
                      <span className="badge badge-primary">{product.category?.displayName || 'Sin categoría'}</span>
                    </div>

                    {/* Acciones */}
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleStatusToggle(product.id, product.isActive)}
                        style={{
                          flex: 1,
                          padding: '6px',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          background: product.isActive ? 'var(--color-warning-bg)' : 'var(--color-success-bg)',
                          color: product.isActive ? 'var(--color-warning)' : 'var(--color-success)',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 500
                        }}
                      >
                        {product.isActive ? '👁️ Desactivar' : '✅ Activar'}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        style={{
                          padding: '6px 12px',
                          border: 'none',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--color-error-bg)',
                          color: 'var(--color-error)',
                          cursor: 'pointer',
                          fontSize: 12,
                          fontWeight: 500
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty state */}
            {products.length === 0 && !loading && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 60 }}>
                <span style={{ fontSize: 64, display: 'block', marginBottom: 16 }}>📦</span>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No hay productos</h3>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: 24 }}>Crea tu primer producto o importa desde redes sociales</p>
                <a href="/import" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>Importar Post →</a>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
