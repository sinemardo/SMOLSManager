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

        {/* Categorías como cards - diseño original mejorado */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Productos por Categoría</h3>
          {stats.productsByCategory?.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 12 }}>
              {stats.productsByCategory.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + (i * 0.05) }}
                  onClick={() => navigate('/catalog?category=' + cat.name + '&id=' + cat.name)}
                  style={{
                    background: '#fff',
                    padding: 20,
                    borderRadius: 16,
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    border: '2px solid transparent',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(79,70,229,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
                >
                  <p style={{ fontSize: 32, fontWeight: 700, color: '#4f46e5', marginBottom: 4 }}>{cat.count}</p>
                  <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{cat.name}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>productos</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 16 }}>
              <span style={{ fontSize: 40 }}>📂</span>
              <p style={{ color: '#6b7280', marginTop: 8 }}>No hay productos aún</p>
            </div>
          )}
        </motion.div>

        {/* Órdenes recientes */}
        {stats.recentOrders?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginTop: 24 }}>
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
