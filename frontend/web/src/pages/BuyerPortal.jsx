import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

export default function BuyerPortal({ user, onBack }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(localStorage.getItem('buyer_avatar') || '');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('smols_token');
    if (token) {
      axios.get(API + '/orders', { headers: { Authorization: 'Bearer ' + token } })
        .then(r => setOrders(r.data.orders || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
    const savedWish = localStorage.getItem('buyer_wishlist');
    if (savedWish) setWishlist(JSON.parse(savedWish));
    const savedCart = localStorage.getItem('buyer_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => { localStorage.setItem('buyer_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('buyer_cart', JSON.stringify(cart)); }, [cart]);

  const tabs = [
    { id: 'profile', label: '👤 Perfil', count: null },
    { id: 'cart', label: '🛒 Mi Carrito', count: cart.reduce((s, i) => s + (i.quantity || 1), 0) },
    { id: 'wishlist', label: '❤️ Favoritos', count: wishlist.length },
    { id: 'orders', label: '📋 Historial', count: orders.length }
  ];

  function updateCartQty(id, qty) {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.productId !== id)); return; }
    setCart(prev => prev.map(i => i.productId === id ? { ...i, quantity: qty } : i));
  }
  function removeFromCart(id) { setCart(prev => prev.filter(i => i.productId !== id)); }
  function removeFromWishlist(id) { setWishlist(prev => prev.filter(i => i.productId !== id)); }
  function moveToWishlist(item) {
    setWishlist(prev => [...prev, { productId: item.productId, name: item.name, price: item.price }]);
    removeFromCart(item.productId);
  }
  function addToCartFromWishlist(item) {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    removeFromWishlist(item.productId);
  }

  const cartTotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', fontWeight: 600, color: '#6366f1' }}>← Volver a la tienda</button>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#1f2937' }}>Mi Portal</span>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 32 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 10px', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: 'pointer',
                background: activeTab === tab.id ? '#6366f1' : '#fff', color: activeTab === tab.id ? '#fff' : '#475569',
                boxShadow: activeTab === tab.id ? '0 8px 20px rgba(99,102,241,0.3)' : '0 1px 3px rgba(0,0,0,0.04)'
              }}>
              {tab.label} {tab.count !== null && `(${tab.count})`}
            </button>
          ))}
        </div>

        {/* PERFIL */}
        {activeTab === 'profile' && (
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>👤 Mi Perfil</h2>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24 }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: profileImage ? 'none' : '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 700, overflow: 'hidden', position: 'relative' }}>
                {profileImage ? <img src={profileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (profile.name?.charAt(0)?.toUpperCase() || 'U')}
              </div>
              <div>
                <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files[0]; if (file) { const reader = new FileReader(); reader.onload = (ev) => { setProfileImage(ev.target.result); localStorage.setItem('buyer_avatar', ev.target.result); }; reader.readAsDataURL(file); } }} style={{ display: 'none' }} id="avatarUpload" />
                <button onClick={() => document.getElementById('avatarUpload').click()} style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>📷 Cambiar foto</button>
                {profileImage && <button onClick={() => { setProfileImage(''); localStorage.removeItem('buyer_avatar'); }} style={{ marginLeft: 8, padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>🗑️ Quitar</button>}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 16, maxWidth: 500 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Nombre</label><input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Email</label><input value={profile.email} disabled style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, background: '#f9fafb', boxSizing: 'border-box' }} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Teléfono</label><input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="+34 600 000 000" /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Dirección</label><input value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="Calle, Ciudad" /></div>
              <button style={{ padding: '12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>💾 Guardar cambios</button>
            </div>
          </div>
        )}

        {/* CARRITO */}
        {activeTab === 'cart' && (
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>🛒 Mi Carrito</h2>
              {cart.length > 0 && <button onClick={() => setCart([])} style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Vaciar</button>}
            </div>
            {cart.length === 0 ? <div style={{ textAlign: 'center', padding: 40 }}><span style={{ fontSize: 48 }}>🛒</span><p style={{ color: '#64748b', marginTop: 12 }}>Carrito vacío</p></div> : (
              <>
                {cart.map(item => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ flex: 1 }}><p style={{ fontWeight: 600 }}>{item.name}</p><p style={{ color: '#6366f1', fontWeight: 700 }}>€{item.price}</p></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateCartQty(item.productId, (item.quantity || 1) - 1)} style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>−</button>
                      <span style={{ fontWeight: 600 }}>{item.quantity || 1}</span>
                      <button onClick={() => updateCartQty(item.productId, (item.quantity || 1) + 1)} style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>+</button>
                      <button onClick={() => moveToWishlist(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>❤️</button>
                      <button onClick={() => removeFromCart(item.productId)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: '16px 0', borderTop: '2px solid #e2e8f0' }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}>€{cartTotal.toFixed(2)}</span>
                </div>
                <button style={{ width: '100%', marginTop: 16, padding: '14px', background: '#059669', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>Realizar Pedido</button>
              </>
            )}
          </div>
        )}

        {/* WISHLIST */}
        {activeTab === 'wishlist' && (
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>❤️ Mis Favoritos ({wishlist.length})</h2>
            {wishlist.length === 0 ? <div style={{ textAlign: 'center', padding: 40 }}><span style={{ fontSize: 48 }}>❤️</span><p style={{ color: '#64748b', marginTop: 12 }}>No tienes favoritos</p></div> : (
              wishlist.map(item => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                  <div><p style={{ fontWeight: 600 }}>{item.name}</p><p style={{ color: '#6366f1', fontWeight: 700 }}>€{item.price}</p></div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => addToCartFromWishlist(item)} style={{ padding: '8px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>🛒</button>
                    <button onClick={() => removeFromWishlist(item.productId)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* HISTORIAL */}
        {activeTab === 'orders' && (
          <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>📋 Historial de Pedidos</h2>
            {loading ? <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando...</p> : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 40 }}><span style={{ fontSize: 48 }}>📭</span><p style={{ color: '#64748b', marginTop: 12 }}>No tienes pedidos aún</p></div>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{ padding: 16, marginBottom: 12, background: '#f9fafb', borderRadius: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>#{order.id?.substring(0, 8)}</span>
                    <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: order.status === 'delivered' ? '#ecfdf5' : '#fffbeb', color: order.status === 'delivered' ? '#059669' : '#d97706' }}>{order.status}</span>
                  </div>
                  {order.items?.map(item => (
                    <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                      <span>{item.product?.name} x{item.quantity}</span>
                      <span>€{(item.price * item.quantity)?.toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ textAlign: 'right', marginTop: 8, fontWeight: 700, color: '#6366f1' }}>Total: €{order.totalAmount?.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
