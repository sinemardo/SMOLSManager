import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

export default function BuyerPortal({ user, onBack }) {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('smols_token');
    
    // Cargar pedidos
    if (token) {
      axios.get(API + '/orders', { headers: { Authorization: 'Bearer ' + token } })
        .then(r => setOrders(r.data.orders || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }

    // Cargar wishlist y carrito desde localStorage
    const savedWish = localStorage.getItem('buyer_wishlist');
    if (savedWish) setWishlist(JSON.parse(savedWish));
    
    const savedCart = localStorage.getItem('buyer_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Guardar cambios en localStorage
  useEffect(() => {
    localStorage.setItem('buyer_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('buyer_cart', JSON.stringify(cart));
  }, [cart]);

  function removeFromWishlist(productId) {
    setWishlist(prev => prev.filter(i => i.productId !== productId));
  }

  function addToCartFromWishlist(item) {
    setCart(prev => {
      const exists = prev.find(i => i.productId === item.productId);
      if (exists) return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    removeFromWishlist(item.productId);
  }

  function updateCartQty(productId, qty) {
    if (qty <= 0) {
      setCart(prev => prev.filter(i => i.productId !== productId));
      return;
    }
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i));
  }

  function removeFromCart(productId) {
    setCart(prev => prev.filter(i => i.productId !== productId));
  }

  function moveToWishlist(item) {
    setWishlist(prev => [...prev, { productId: item.productId, name: item.name, price: item.price }]);
    removeFromCart(item.productId);
  }

  const cartTotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const cartCount = cart.reduce((s, i) => s + (i.quantity || 1), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <nav style={{ background: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>← Volver a la tienda</button>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#6366f1' }}>Mi Portal</span>
        <span style={{ fontSize: 14, color: '#64748b' }}>{user?.name}</span>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 32 }}>
        {/* Tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 32 }}>
          {[
            { id: 'orders', label: '📋 Historial de Pedidos', count: orders.length },
            { id: 'cart', label: '🛒 Mi Carrito', count: cartCount },
            { id: 'wishlist', label: '❤️ Favoritos', count: wishlist.length }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer',
                background: activeTab === tab.id ? '#6366f1' : '#fff',
                color: activeTab === tab.id ? '#fff' : '#475569',
                boxShadow: activeTab === tab.id ? '0 8px 20px rgba(99,102,241,0.3)' : '0 1px 3px rgba(0,0,0,0.06)'
              }}>
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* TAB: Historial de Pedidos */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Historial de Pedidos</h2>
            {loading ? (
              <p style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>Cargando pedidos...</p>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16 }}>
                <span style={{ fontSize: 48 }}>📭</span>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 12 }}>No tienes pedidos aún</h3>
                <p style={{ color: '#64748b', marginTop: 8 }}>Explora el catálogo y haz tu primer pedido</p>
                <button onClick={onBack} style={{ marginTop: 16, padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Ir de compras</button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{ background: '#fff', padding: 24, borderRadius: 16, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: 16 }}>Pedido #{order.id?.substring(0, 8)}</p>
                      <p style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span style={{ padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                      background: order.status === 'delivered' ? '#ecfdf5' : order.status === 'cancelled' ? '#fef2f2' : '#fffbeb',
                      color: order.status === 'delivered' ? '#059669' : order.status === 'cancelled' ? '#dc2626' : '#d97706'
                    }}>{order.status}</span>
                  </div>
                  
                  {order.items?.map(item => (
                    <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f9fafb', fontSize: 14 }}>
                      <span style={{ fontWeight: 500 }}>{item.product?.name || 'Producto'}</span>
                      <span>x{item.quantity} · €{(item.price * item.quantity)?.toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, padding: '12px 0', borderTop: '2px solid #f1f5f9' }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#6366f1' }}>Total: €{order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB: Carrito */}
        {activeTab === 'cart' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700 }}>🛒 Mi Carrito ({cartCount} items)</h2>
              {cart.length > 0 && <button onClick={() => setCart([])} style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Vaciar carrito</button>}
            </div>
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16 }}>
                <span style={{ fontSize: 48 }}>🛒</span>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 12 }}>Tu carrito está vacío</h3>
                <button onClick={onBack} style={{ marginTop: 16, padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Ir de compras</button>
              </div>
            ) : (
              <>
                {cart.map(item => (
                  <div key={item.productId} style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</p>
                      <p style={{ color: '#6366f1', fontWeight: 700, fontSize: 14 }}>€{item.price} c/u</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button onClick={() => updateCartQty(item.productId, (item.quantity || 1) - 1)} style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 16 }}>−</button>
                      <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity || 1}</span>
                      <button onClick={() => updateCartQty(item.productId, (item.quantity || 1) + 1)} style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 16 }}>+</button>
                      <button onClick={() => moveToWishlist(item)} style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: 16, marginLeft: 8 }} title="Mover a favoritos">❤️</button>
                      <button onClick={() => removeFromCart(item.productId)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
                    </div>
                  </div>
                ))}
                <div style={{ background: '#fff', padding: 20, borderRadius: 12, marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 24, fontWeight: 700, color: '#6366f1' }}>€{cartTotal.toFixed(2)}</span>
                </div>
                <button style={{ width: '100%', marginTop: 16, padding: '16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>
                  Realizar Pedido
                </button>
              </>
            )}
          </div>
        )}

        {/* TAB: Favoritos */}
        {activeTab === 'wishlist' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>❤️ Mis Favoritos ({wishlist.length})</h2>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16 }}>
                <span style={{ fontSize: 48 }}>❤️</span>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginTop: 12 }}>No tienes favoritos</h3>
                <p style={{ color: '#64748b', marginTop: 8 }}>Haz clic en 🤍 en cualquier producto para guardarlo</p>
                <button onClick={onBack} style={{ marginTop: 16, padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Explorar productos</button>
              </div>
            ) : (
              wishlist.map(item => (
                <div key={item.productId} style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</p>
                    <p style={{ color: '#6366f1', fontWeight: 700 }}>€{item.price}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => addToCartFromWishlist(item)} style={{ padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>🛒 Agregar</button>
                    <button onClick={() => removeFromWishlist(item.productId)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
