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
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [showWishlist, setShowWishlist] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);

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
    axios.get(API + '/products' + (cat ? '?category=' + cat : '?limit=50'))
      .then(r => setProducts(r.data.products || []));
  }

  async function handleAuth(e) {
    e.preventDefault();
    try {
      const endpoint = authMode === 'register' ? '/auth/register' : '/auth/login';
      const res = await axios.post(API + endpoint, authForm);
      localStorage.setItem('smols_token', res.data.accessToken);
      setUser(res.data.user);
      setShowAuth(false);
    } catch (err) {
      setAuthMsg('Error: ' + (err.response?.data?.message || 'Intenta de nuevo'));
    }
  }

  function addToCart(product, e) {
    if (e) e.stopPropagation();
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  }

  function toggleWishlist(product, e) {
    if (e) e.stopPropagation();
    setWishlist(prev => {
      const exists = prev.find(i => i.productId === product.id);
      if (exists) return prev.filter(i => i.productId !== product.id);
      return [...prev, { productId: product.id, name: product.name, price: product.price }];
    });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
        <span style={{ fontWeight: 700, fontSize: 20, color: '#6366f1' }}>SMOLS</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {user ? (
            <>
              <button onClick={() => setShowWishlist(true)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>❤️{wishlist.length > 0 ? wishlist.length : ''}</button>
              <button onClick={() => setShowCart(true)} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer' }}>🛒{cartCount > 0 ? cartCount : ''}</button>
              <span>{user.name}</span>
              <button onClick={() => { localStorage.removeItem('smols_token'); setUser(null); setCart([]); setWishlist([]); }} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', borderRadius: 8, background: 'none', cursor: 'pointer' }}>Salir</button>
            </>
          ) : (
            <>
              <button onClick={() => { setShowAuth(true); setAuthMode('login'); }} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Iniciar sesión</button>
              <button onClick={() => { setShowAuth(true); setAuthMode('register'); }} style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Comenzar a vender</button>
            </>
          )}
        </div>
      </nav>

      {showAuth && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200 }} onClick={(e) => { if (e.target === e.currentTarget) setShowAuth(false); }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, width: 380 }}>
            <h2 style={{ textAlign: 'center', marginBottom: 16 }}>{authMode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}</h2>
            {authMsg && <div style={{ padding: 10, borderRadius: 8, marginBottom: 12, background: '#fef2f2', color: '#dc2626', fontSize: 13 }}>{authMsg}</div>}
            <form onSubmit={handleAuth} style={{ display: 'grid', gap: 10 }}>
              {authMode === 'register' && <><input type="text" placeholder="Nombre" value={authForm.name} onChange={e => setAuthForm({...authForm, name: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8 }} required /><input type="text" placeholder="Tienda (opcional)" value={authForm.storeName} onChange={e => setAuthForm({...authForm, storeName: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8 }} /></>}
              <input type="email" placeholder="Email" value={authForm.email} onChange={e => setAuthForm({...authForm, email: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8 }} required />
              <input type="password" placeholder="Contraseña" value={authForm.password} onChange={e => setAuthForm({...authForm, password: e.target.value})} style={{ padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8 }} required />
              <button type="submit" style={{ padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>{authMode === 'register' ? 'Crear cuenta' : 'Iniciar sesión'}</button>
            </form>
            <button onClick={() => setShowAuth(false)} style={{ width: '100%', marginTop: 8, padding: 8, background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      )}

      {showCart && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 250, padding: 16 }} onClick={(e) => { if (e.target === e.currentTarget) setShowCart(false); }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 500, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>🛒 Carrito ({cartCount})</h2>
              <button onClick={() => setShowCart(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            {cart.length === 0 ? <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Carrito vacío</p> : (
              <>
                {cart.map(item => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <p style={{ fontWeight: 600 }}>{item.name}</p>
                      <p style={{ color: '#6366f1', fontWeight: 700 }}>€{item.price} x {item.quantity} = €{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: '16px 0', borderTop: '2px solid #e2e8f0' }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}>€{cartTotal.toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {showWishlist && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 260, padding: 16 }} onClick={(e) => { if (e.target === e.currentTarget) setShowWishlist(false); }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 450, padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>❤️ Favoritos ({wishlist.length})</h2>
              <button onClick={() => setShowWishlist(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
            </div>
            {wishlist.length === 0 ? <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>No tienes favoritos</p> : (
              wishlist.map(item => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{item.name}</p>
                    <p style={{ color: '#6366f1', fontWeight: 700 }}>€{item.price}</p>
                  </div>
                  <button onClick={() => toggleWishlist(item)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>❤️</button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <header style={{ background: 'linear-gradient(135deg, #0f172a, #312e81)', color: '#fff', padding: '80px 24px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 800 }}>Tu tienda online desde redes sociales</h1>
        <p style={{ fontSize: 18, opacity: 0.8, marginTop: 12 }}>Importa tus posts de Instagram, TikTok y Facebook</p>
      </header>

      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, textAlign: 'center', marginBottom: 28 }}>Categorías</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 40 }}>
          <button onClick={() => loadProducts('')} style={{ padding: '10px 22px', borderRadius: 25, border: 'none', background: !selectedCategory ? '#6366f1' : '#fff', color: !selectedCategory ? '#fff' : '#475569', cursor: 'pointer', fontWeight: 600 }}>Todas</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => loadProducts(cat.id)} style={{ padding: '10px 22px', borderRadius: 25, border: 'none', background: selectedCategory === cat.id ? '#6366f1' : '#fff', color: selectedCategory === cat.id ? '#fff' : '#475569', cursor: 'pointer', fontWeight: 600 }}>{cat.displayName}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {products.map(p => (
            <div key={p.id} onClick={() => setSelectedProduct(p)} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
              <div style={{ height: 180, background: 'linear-gradient(135deg, #eef2ff, #f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 56 }}>📦</span>
              </div>
              <div style={{ padding: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>{p.name}</h3>
                <p style={{ color: '#64748b', fontSize: 13, marginBottom: 12 }}>{p.description?.substring(0, 80)}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}>€{p.price}</span>
                </div>
                <button onClick={(e) => toggleWishlist(p, e)} style={{ width: '100%', padding: '6px', background: wishlist.some(i => i.productId === p.id) ? '#fef2f2' : '#f8fafc', color: wishlist.some(i => i.productId === p.id) ? '#dc2626' : '#94a3b8', border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', fontSize: 16 }}>
                  {wishlist.some(i => i.productId === p.id) ? '❤️' : '🤍'}
                </button>
                <button onClick={(e) => addToCart(p, e)} style={{ width: '100%', marginTop: 6, padding: '8px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>🛒 Agregar al carrito</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300, padding: 16 }} onClick={(e) => { if (e.target === e.currentTarget) setSelectedProduct(null); }}>
          <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 650, padding: 28 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>{selectedProduct.name}</h2>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#6366f1', marginTop: 8 }}>€{selectedProduct.price}</p>
            <p style={{ color: '#64748b', marginTop: 12 }}>{selectedProduct.description}</p>
            <button onClick={() => setSelectedProduct(null)} style={{ width: '100%', marginTop: 20, padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 600, cursor: 'pointer' }}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
