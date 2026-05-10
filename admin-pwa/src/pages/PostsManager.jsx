import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function PostsManager() {
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [message, setMessage] = useState('');
  const [converting, setConverting] = useState(null);
  const [convertForm, setConvertForm] = useState({ name: '', price: '', categoryId: '' });
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsRes, prodsRes, catsRes] = await Promise.all([
        api.get('/social/posts'),
        api.get('/products?limit=100'),
        api.get('/categories')
      ]);
      setPosts(postsRes.data.posts || []);
      setProducts(prodsRes.data.products || []);
      setCategories(catsRes.data.categories || []);
    } catch (err) {
      setMessage('Error al cargar datos');
    }
  };

  const handleDeletePost = async (id) => {
    if (!confirm('Eliminar este post?')) return;
    try {
      await api.delete('/social/posts/' + id);
      setPosts(posts.filter(p => p.id !== id));
      setMessage('Post eliminado');
    } catch (err) {
      setMessage('Error al eliminar');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Desactivar este producto?')) return;
    try {
      await api.delete('/products/' + id);
      setProducts(products.filter(p => p.id !== id));
      setMessage('Producto desactivado');
    } catch (err) {
      setMessage('Error al desactivar');
    }
  };

  const handleConvert = async (postId) => {
    if (!convertForm.name || !convertForm.price || !convertForm.categoryId) {
      setMessage('Completa todos los campos: nombre, precio y categoria');
      return;
    }
    try {
      await api.post('/social/convert/' + postId, convertForm);
      setMessage('Producto creado exitosamente');
      setConverting(null);
      setConvertForm({ name: '', price: '', categoryId: '' });
      loadData();
    } catch (err) {
      setMessage('Error al convertir: ' + (err.response?.data?.message || ''));
    }
  };

  const openConvert = (post) => {
    setConverting(post.id);
    setConvertForm({
      name: post.caption?.substring(0, 100) || '',
      price: '',
      categoryId: categories[0]?.id || ''
    });
  };

  const stats = {
    totalPosts: posts.length,
    convertedPosts: posts.filter(p => p.isConverted).length,
    pendingPosts: posts.filter(p => !p.isConverted).length,
    totalProducts: products.length,
    activeProducts: products.filter(p => p.isActive).length
  };

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>📋 Gestión de Posts y Productos</h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Administra tus contenidos desde un solo lugar</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Posts', value: stats.totalPosts, color: '#4f46e5', bg: '#eef2ff' },
            { label: 'Convertidos', value: stats.convertedPosts, color: '#059669', bg: '#ecfdf5' },
            { label: 'Pendientes', value: stats.pendingPosts, color: '#d97706', bg: '#fffbeb' },
            { label: 'Productos', value: stats.totalProducts, color: '#7c3aed', bg: '#f5f3ff' },
            { label: 'Activos', value: stats.activeProducts, color: '#059669', bg: '#ecfdf5' }
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, padding: '12px 16px', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 11, color: '#6b7280' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Mensaje */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              marginBottom: 16,
              background: message.includes('Error') ? '#fef2f2' : '#ecfdf5',
              color: message.includes('Error') ? '#dc2626' : '#059669',
              fontSize: 14,
              cursor: 'pointer'
            }}
            onClick={() => setMessage('')}
          >
            {message}
          </motion.div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#fff', borderRadius: 12, padding: 4 }}>
          <button onClick={() => setActiveTab('posts')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 8, background: activeTab === 'posts' ? '#eef2ff' : 'transparent', color: activeTab === 'posts' ? '#4f46e5' : '#6b7280', cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
            📋 Posts ({posts.length})
          </button>
          <button onClick={() => setActiveTab('products')} style={{ flex: 1, padding: '10px', border: 'none', borderRadius: 8, background: activeTab === 'products' ? '#eef2ff' : 'transparent', color: activeTab === 'products' ? '#4f46e5' : '#6b7280', cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
            📦 Productos ({products.length})
          </button>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div style={{ display: 'grid', gap: 12 }}>
            {posts.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12 }}>
                <span style={{ fontSize: 48 }}>📋</span>
                <p style={{ color: '#6b7280', marginTop: 12 }}>No hay posts. <a href="/import" style={{ color: '#4f46e5' }}>Importa tu primer post</a></p>
              </div>
            )}
            {posts.map(post => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ background: '#eef2ff', color: '#4f46e5', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                        {post.platform}
                      </span>
                      {post.isConverted ? (
                        <span style={{ background: '#ecfdf5', color: '#059669', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                          ✅ Convertido
                        </span>
                      ) : (
                        <span style={{ background: '#fffbeb', color: '#d97706', padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                          ⏳ Pendiente
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize: 14, marginBottom: 4 }}>{post.caption || 'Sin descripción'}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>❤️ {post.likes} | 💬 {post.comments} | {new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {!post.isConverted && (
                      converting === post.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 200 }}>
                          <input type="text" value={convertForm.name} onChange={e => setConvertForm({ ...convertForm, name: e.target.value })} placeholder="Nombre" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, width: '100%', boxSizing: 'border-box' }} />
                          <input type="number" value={convertForm.price} onChange={e => setConvertForm({ ...convertForm, price: e.target.value })} placeholder="Precio" style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, width: '100%', boxSizing: 'border-box' }} />
                          <select value={convertForm.categoryId} onChange={e => setConvertForm({ ...convertForm, categoryId: e.target.value })} style={{ padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: 6, fontSize: 13, width: '100%', boxSizing: 'border-box' }}>
                            <option value="">Categoría</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
                          </select>
                          <div style={{ display: 'flex', gap: 6 }}>
                            <button onClick={() => handleConvert(post.id)} style={{ flex: 1, padding: '6px', background: '#059669', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Convertir</button>
                            <button onClick={() => setConverting(null)} style={{ padding: '6px 12px', background: '#e5e7eb', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Cancelar</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => openConvert(post)} style={{ padding: '8px 14px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>
                          → Convertir
                        </button>
                      )
                    )}
                    <button onClick={() => handleDeletePost(post.id)} style={{ padding: '8px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 16 }}>
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div style={{ display: 'grid', gap: 12 }}>
            {products.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12 }}>
                <span style={{ fontSize: 48 }}>📦</span>
                <p style={{ color: '#6b7280', marginTop: 12 }}>No hay productos. <a href="/import" style={{ color: '#4f46e5' }}>Importa y convierte posts</a></p>
              </div>
            )}
            {products.map(product => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 16 }}>{product.name}</span>
                    <span style={{ background: product.isActive ? '#ecfdf5' : '#fef2f2', color: product.isActive ? '#059669' : '#dc2626', padding: '2px 10px', borderRadius: 20, fontSize: 11 }}>
                      {product.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 13, color: '#6b7280' }}>
                    <span>€{product.price}</span>
                    <span>👁️ {product.views || 0}</span>
                    <span>{product.category?.displayName}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => handleDeleteProduct(product.id)} style={{ padding: '8px 14px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                    🗑️ Desactivar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
