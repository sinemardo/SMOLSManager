import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

const statusColors = {
  pending: { bg: '#fffbeb', color: '#d97706', label: 'Pendiente' },
  confirmed: { bg: '#eff6ff', color: '#2563eb', label: 'Confirmado' },
  shipped: { bg: '#fff7ed', color: '#ea580c', label: 'Enviado' },
  delivered: { bg: '#ecfdf5', color: '#059669', label: 'Entregado' },
  cancelled: { bg: '#fef2f2', color: '#dc2626', label: 'Cancelado' }
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [expanded, setExpanded] = useState(null);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      setMessage('Error al cargar órdenes');
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch('/orders/' + orderId + '/status', { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setMessage('Estado actualizado');
    } catch (err) {
      setMessage('Error al actualizar estado');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => o.status === 'delivered').reduce((s, o) => s + (o.totalAmount || 0), 0)
  };

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>📋 Órdenes</h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Gestiona los pedidos de tu tienda</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total', value: stats.total, icon: '📋', color: '#4f46e5', bg: '#eef2ff' },
            { label: 'Pendientes', value: stats.pending, icon: '⏳', color: '#d97706', bg: '#fffbeb' },
            { label: 'Entregados', value: stats.delivered, icon: '✅', color: '#059669', bg: '#ecfdf5' },
            { label: 'Ingresos', value: '€' + stats.revenue.toFixed(2), icon: '💰', color: '#7c3aed', bg: '#f5f3ff' }
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, padding: '16px', borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.icon} {s.label}</p>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                background: filter === f ? (statusColors[f]?.bg || '#eef2ff') : '#fff',
                color: filter === f ? (statusColors[f]?.color || '#4f46e5') : '#6b7280',
                boxShadow: filter === f ? '0 2px 8px rgba(0,0,0,0.1)' : '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              {f === 'all' ? 'Todos' : statusColors[f]?.label || f}
            </button>
          ))}
        </div>

        {/* Mensaje */}
        {message && (
          <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, background: '#ecfdf5', color: '#059669', fontSize: 14, cursor: 'pointer' }} onClick={() => setMessage('')}>
            {message}
          </div>
        )}

        {/* Órdenes */}
        <div style={{ display: 'grid', gap: 12 }}>
          {filteredOrders.length === 0 && (
            <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12 }}>
              <span style={{ fontSize: 48 }}>📭</span>
              <p style={{ color: '#6b7280', marginTop: 12 }}>No hay órdenes en este estado</p>
            </div>
          )}
          {filteredOrders.map(order => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ background: '#fff', borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}
            >
              <div
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                style={{ padding: 16, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 24 }}>📦</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{order.buyer?.name || 'Cliente'}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} productos</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#4f46e5' }}>€{order.totalAmount?.toFixed(2)}</span>
                  <span style={{ background: statusColors[order.status]?.bg, color: statusColors[order.status]?.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                    {statusColors[order.status]?.label}
                  </span>
                </div>
              </div>

              {/* Expandido */}
              {expanded === order.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '0 16px 16px', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ marginTop: 16 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Productos:</p>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f9fafb', fontSize: 14 }}>
                        <span>{item.product?.name || 'Producto'} x{item.quantity}</span>
                        <span style={{ fontWeight: 500 }}>€{(item.price * item.quantity)?.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  {order.shippingAddress?.street && (
                    <div style={{ marginTop: 16 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Dirección de envío:</p>
                      <p style={{ fontSize: 13, color: '#6b7280' }}>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}</p>
                    </div>
                  )}
                  {order.notes && (
                    <div style={{ marginTop: 16 }}>
                      <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Notas:</p>
                      <p style={{ fontSize: 13, color: '#6b7280' }}>{order.notes}</p>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    {(order.status === 'pending' || order.status === 'confirmed' || order.status === 'shipped') && (
                      <button onClick={() => handleStatusChange(order.id, order.status === 'pending' ? 'confirmed' : order.status === 'confirmed' ? 'shipped' : 'delivered')} style={{ padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                        {order.status === 'pending' ? '✅ Confirmar' : order.status === 'confirmed' ? '📦 Marcar Enviado' : '🏠 Marcar Entregado'}
                      </button>
                    )}
                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                      <button onClick={() => handleStatusChange(order.id, 'cancelled')} style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                        ❌ Cancelar
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
