import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

export default function BuyerPortal({ user, onBack }) {
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const token = localStorage.getItem('smols_token');
    if (token) {
      axios.get(API + '/orders', { headers: { Authorization: 'Bearer ' + token } })
        .then(r => setOrders(r.data.orders || []))
        .catch(() => {});
    }
    // Cargar favoritos desde localStorage
    const saved = localStorage.getItem('buyer_favorites');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>← Volver</button>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#6366f1' }}>Mi Portal</span>
        <span style={{ fontSize: 14, color: '#64748b' }}>{user?.name}</span>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: 32 }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 32 }}>
          <button onClick={() => setActiveTab('orders')} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 10, background: activeTab === 'orders' ? '#6366f1' : '#fff', color: activeTab === 'orders' ? '#fff' : '#475569', fontWeight: 600, cursor: 'pointer' }}>📋 Historial de Pedidos</button>
          <button onClick={() => setActiveTab('favorites')} style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 10, background: activeTab === 'favorites' ? '#6366f1' : '#fff', color: activeTab === 'favorites' ? '#fff' : '#475569', fontWeight: 600, cursor: 'pointer' }}>❤️ Favoritos</button>
        </div>

        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Historial de Pedidos</h2>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16 }}>
                <span style={{ fontSize: 48 }}>📭</span>
                <p style={{ color: '#64748b', marginTop: 12 }}>No tienes pedidos aún</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{ background: '#fff', padding: 20, borderRadius: 12, marginBottom: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontWeight: 600 }}>Pedido #{order.id?.substring(0, 8)}</span>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: order.status === 'delivered' ? '#ecfdf5' : '#fffbeb', color: order.status === 'delivered' ? '#059669' : '#d97706' }}>{order.status}</span>
                  </div>
                  {order.items?.map(item => (
                    <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f9fafb', fontSize: 14 }}>
                      <span>{item.product?.name} x{item.quantity}</span>
                      <span style={{ fontWeight: 500 }}>€{(item.price * item.quantity)?.toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ textAlign: 'right', marginTop: 12 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: '#6366f1' }}>Total: €{order.totalAmount?.toFixed(2)}</span>
                    <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>Mis Favoritos</h2>
            {favorites.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16 }}>
                <span style={{ fontSize: 48 }}>❤️</span>
                <p style={{ color: '#64748b', marginTop: 12 }}>No tienes favoritos guardados</p>
              </div>
            ) : (
              favorites.map(item => (
                <div key={item.productId} style={{ background: '#fff', padding: 16, borderRadius: 12, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div>
                    <p style={{ fontWeight: 600 }}>{item.name}</p>
                    <p style={{ color: '#6366f1', fontWeight: 700 }}>€{item.price}</p>
                  </div>
                  <button style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>❤️</button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
