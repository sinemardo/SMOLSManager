import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => { loadOrders(); }, []);

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data.orders || []);
    } catch (err) { setMessage('Error al cargar órdenes'); }
  };

  const handleStatusChange = async (orderId, newStatus, e) => {
    e.stopPropagation();
    try {
      await api.patch('/orders/' + orderId + '/status', { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setMessage('Estado actualizado');
    } catch (err) { setMessage('Error al actualizar'); }
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
          <p style={{ color: '#6b7280', fontSize: 14 }}>Gestiona los pedidos de tu tienda</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Total', value: stats.total, icon: '📋', color: '#4f46e5', bg: '#eef2ff' },
            { label: 'Pendientes', value: stats.pending, icon: '⏳', color: '#d97706', bg: '#fffbeb' },
            { label: 'Entregados', value: stats.delivered, icon: '✅', color: '#059669', bg: '#ecfdf5' },
            { label: 'Ingresos', value: '€' + stats.revenue.toFixed(2), icon: '💰', color: '#7c3aed', bg: '#f5f3ff' }
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, padding: 16, borderRadius: 12, textAlign: 'center' }}>
              <p style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.value}</p>
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.icon} {s.label}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
          {['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 16px', borderRadius: 20, border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: filter === f ? (statusColors[f]?.bg || '#eef2ff') : '#fff', color: filter === f ? (statusColors[f]?.color || '#4f46e5') : '#6b7280' }}>
              {f === 'all' ? 'Todos' : statusColors[f]?.label || f}
            </button>
          ))}
        </div>

        {message && <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, background: '#ecfdf5', color: '#059669', fontSize: 14, cursor: 'pointer' }} onClick={() => setMessage('')}>{message}</div>}

        <div style={{ display: 'grid', gap: 12 }}>
          {filteredOrders.length === 0 && <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12 }}><span style={{ fontSize: 48 }}>📭</span><p style={{ color: '#6b7280', marginTop: 12 }}>No hay órdenes</p></div>}
          {filteredOrders.map(order => (
            <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => navigate('/orders/' + order.id)}
              style={{ background: '#fff', padding: 16, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 24 }}>📦</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15 }}>{order.buyer?.name || 'Cliente'}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#4f46e5' }}>€{order.totalAmount?.toFixed(2)}</span>
                <span style={{ background: statusColors[order.status]?.bg, color: statusColors[order.status]?.color, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
                  {statusColors[order.status]?.label}
                </span>
                <button onClick={(e) => handleStatusChange(order.id, order.status === 'pending' ? 'confirmed' : 'delivered', e)}
                  style={{ padding: '6px 12px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>
                  {order.status === 'pending' ? 'Confirmar' : 'Entregar'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
