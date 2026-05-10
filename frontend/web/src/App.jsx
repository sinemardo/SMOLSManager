import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('register');
  const [authForm, setAuthForm] = useState({ email: '', password: '', name: '', storeName: '' });
  const [authMsg, setAuthMsg] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    axios.get(API + '/categories').then(r => setCategories(r.data.categories));
    loadProducts('');
    const token = localStorage.getItem('smols_token');
    if (token) {
      axios.get(API + '/auth/me', { headers: { Authorization: 'Bearer ' + token } })
        .then(r => setUser(r.data.user))
        .catch(() => localStorage.removeItem('smols_token'));
    }
  }, []);

  function loadProducts(cat) {
    setSelectedCategory(cat);
    axios.get(API + '/products' + (cat ? '?category=' + cat : '?limit=50')).then(r => setProducts(r.data.products || []));
  }

  async function handleAuth(e) {
    e.preventDefault();
    try {
      const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
      const res = await axios.post(API + endpoint, authForm);
      localStorage.setItem('smols_token', res.data.accessToken);
      setUser(res.data.user);
      setShowAuth(false);
      setAuthMsg('');
    } catch (err) {
      setAuthMsg('Error: ' + (err.response?.data?.message || 'Intenta de nuevo'));
    }
  }

  function logout() {
    localStorage.removeItem('smols_token');
    setUser(null);
  }

  function openProduct(product) {
    setSelectedProduct(product);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* NAVBAR */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
        <span style={{ fontWeight: 700, fontSize: 20, color: '#6366f1' }}>SMOLS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <span style={{ fontSize: 14 }}>{user.name}</span>
              <button onClick={logout} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 8, background: 'none', cursor: 'pointer', fontSize: 13 }}>Salir</button>
              <button onClick={() => setShowCart(true)} style={{ position: 'relative', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>
                🛒
                {cartCount > 0 && <span style={{ position: 'absolute', top: -5, right: -5, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setShowAuth(true); setAuthMode('login'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Iniciar sesión</button>
              <button onClick={() => { setShowAuth(true); setAuthMode('register'); }} style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Comenzar a vender</button>
            </>
          )}
        </div>
      </nav>

      {/* MODAL AUTH */}
      {showAuth && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuth(false); }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, width: 380 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 16 }}>{authMode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
            {authMsg && <div style={{ padding: 10, borderRadius: 8, marginBottom: 12, background: '#fef2f2', color: '#dc2626', fontSize: 13 }}>{authMsg}</div>}
            <form onSubmit={handleAuth} style={{ display: 'grid', gap: 10 }}>
              {authMode === 'register' && (
                <>
                  <input type="text" placeholder="Nombre" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8 }} required />
                  <input type="text" placeholder="Tienda (opcional)" value={authForm.storeName} onChange={e => setAuthForm({...authForm, storeName: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8 }} />
                </>
              )}
              <input type="email" placeholder="Email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8 }} required />
              <input type="password" placeholder="Contraseña" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8 }} required />
              <button type="submit" style={{ padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>{authMode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}</button>
            </form>
            <p style={{ textAlign: 'center', marginTop: 12, fontSize: 13 }}>
              {authMode === 'register' ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
              <button onClick={() => setAuthMode(authMode === 'register' ? 'login' : 'register')} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>{authMode === 'register' ? 'Inicia sesión' : 'Regístrate'}</button>
            </p>
            <button onClick={() => setShowAuth(false)} style={{ width: '100%', marginTop: 8, padding: 8, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: 13 }}>Cancelar</button>
          </div>
        </div>
      )}

      {/* MODAL DETALLE */}
      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 16 }}
          onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null); }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 650, maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ height: 250, background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <span style={{ fontSize: 72 }}>📦</span>
              <button onClick={() => setSelectedProduct(null)} style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: 28 }}>
              <span style={{ background: '#eef2ff', color: '#6366f1', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{selectedProduct.category?.displayName}</span>
              <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 10 }}>{selectedProduct.name}</h2>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#6366f1', marginTop: 6 }}>€{selectedProduct.price}</p>
              <p style={{ color: '#64748b', marginTop: 12, lineHeight: 1.6 }}>{selectedProduct.description || 'Sin descripción'}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10 }}>
                  <p style={{ fontSize: 12, color: '#64748b' }}>Vendedor</p>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedProduct.seller?.storeName || selectedProduct.seller?.name}</p>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10 }}>
                  <p style={{ fontSize: 12, color: '#64748b' }}>Stock</p>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedProduct.stock || 0} unidades</p>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10 }}>
                  <p style={{ fontSize: 12, color: '#64748b' }}>Origen</p>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedProduct.socialPlatform || 'Manual'}</p>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10 }}>
                  <p style={{ fontSize: 12, color: '#64748b' }}>Vistas</p>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{selectedProduct.views || 0} 👁️</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HERO */}
      <header style={{ background: 'linear-gradient(135deg, #0f172a, #312e81)', color: '#fff', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 800 }}>Tu tienda online desde redes sociales</h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginTop: 12 }}>Importa tus posts de Instagram, TikTok y Facebook</p>
      </header>

      {/* CATEGORÍAS */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, textAlign: 'center', marginBottom: 28 }}>Categorías</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
          <button onClick={() => loadProducts('')} style={{ padding: '10px 22px', borderRadius: 25, border: 'none', background: !selectedCategory ? '#6366f1' : '#fff', color: !selectedCategory ? '#fff' : '#475569', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>Todas</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => loadProducts(cat.id)} style={{ padding: '10px 22px', borderRadius: 25, border: 'none', background: selectedCategory === cat.id ? '#6366f1' : '#fff', color: selectedCategory === cat.id ? '#fff' : '#475569', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>{cat.displayName}</button>
          ))}
        </div>

        {/* PRODUCTOS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {products.map(p => (
            <div key={p.id} onClick={() => openProduct(p)} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer', transition: 'transform 0.2s' }}>
              <div style={{ height: 180, background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 56 }}>📦</span>
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{p.name}</h3>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 12 }}>{p.description?.substring(0, 80)}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}>€{p.price}</span>
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{p.seller?.storeName}</span>`n                <button onClick={(e) => addToCart(p, e)} style={{ width: "100%", marginTop: 10, padding: "8px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13 }}>🛒 Agregar al carrito</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

