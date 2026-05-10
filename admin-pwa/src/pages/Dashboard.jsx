import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    api.get('/kpis/dashboard').then(r => setStats(r.data.kpis)).catch(() => {});
    if (Notification.permission === 'default') Notification.requestPermission();
  }, []);

  if (!stats) return <Layout user={user}><div style={{textAlign:'center',padding:80}}>Cargando dashboard...</div></Layout>;

  const kpis = [
    { label: 'Productos', value: stats.totalProducts, icon: '📦', link: '/catalog', color: '#4f46e5', bg: '#eef2ff' },
    { label: 'Órdenes Hoy', value: stats.ordersToday, icon: '📋', link: '/orders', color: '#059669', bg: '#ecfdf5' },
    { label: 'Ingresos', value: '€' + (stats.totalRevenue || 0).toFixed(2), icon: '💰', link: '/analytics', color: '#d97706', bg: '#fffbeb' },
    { label: 'Vendedores', value: stats.activeSellers, icon: '👥', link: '/analytics', color: '#7c3aed', bg: '#f5f3ff' }
  ];

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>¡Hola, {user.name?.split(' ')[0] || 'Bienvenido'}! 👋</h2>
          <p style={{ color: '#6b7280', fontSize: 14 }}>Así va tu tienda hoy</p>
        </div>

        {/* KPIs clickeables */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {kpis.map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => navigate(kpi.link)}
              style={{ background: kpi.bg, padding: 24, borderRadius: 16, cursor: 'pointer', borderTop: '3px solid ' + kpi.color, transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{kpi.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginTop: 4 }}>{kpi.value}</p>
                </div>
                <span style={{ fontSize: 28 }}>{kpi.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Categorías con barra de progreso */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Productos por Categoría</h3>
          {stats.productsByCategory?.length > 0 ? (
            <div style={{ display: 'grid', gap: 12 }}>
              {stats.productsByCategory.map(cat => {
                const total = stats.productsByCategory.reduce((s, c) => s + c.count, 0);
                const pct = total > 0 ? (cat.count / total) * 100 : 0;
                return (
                  <div key={cat.name} onClick={() => navigate('/catalog')} style={{ cursor: 'pointer' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{cat.name}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#4f46e5' }}>{cat.count} ({Math.round(pct)}%)</span>
                    </div>
                    <div style={{ height: 6, background: '#f3f4f6', borderRadius: 3, overflow: 'hidden' }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: pct + '%' }} transition={{ duration: 0.8, delay: 0.5 }}
                        style={{ height: '100%', background: '#4f46e5', borderRadius: 3 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p style={{ color: '#9ca3af', textAlign: 'center', padding: 20 }}>No hay productos aún</p>
          )}
        </motion.div>

        {/* Órdenes recientes */}
        {stats.recentOrders?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Órdenes Recientes</h3>
            {stats.recentOrders.map(order => (
              <div key={order.id} onClick={() => navigate('/orders/' + order.id)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f9fafb', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{order.buyer?.name || 'Cliente'}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(order.createdAt).toLocaleDateString()} · {order.items?.length || 0} productos</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#4f46e5' }}>€{order.totalAmount?.toFixed(2)}</p>
                  <span style={{ fontSize: 11, background: '#fffbeb', color: '#d97706', padding: '2px 8px', borderRadius: 10 }}>{order.status}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
