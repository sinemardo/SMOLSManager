import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

const kpiConfig = [
  { label: 'Productos', key: 'totalProducts', color: '#4f46e5', bg: '#eef2ff', icon: '📦' },
  { label: 'Órdenes Hoy', key: 'ordersToday', color: '#059669', bg: '#ecfdf5', icon: '📋' },
  { label: 'Ingresos', key: 'totalRevenue', color: '#d97706', bg: '#fffbeb', icon: '💰', format: v => '€' + (v || 0).toFixed(2) },
  { label: 'Vendedores', key: 'activeSellers', color: '#7c3aed', bg: '#f5f3ff', icon: '👥' }
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    api.get('/kpis/dashboard').then(r => setStats(r.data.kpis)).catch(() => {});
  }, []);

  return (
    <Layout user={user}>
      <div style={{ marginBottom: 32 }}>
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}
        >
          ¡Hola, {user.name?.split(' ')[0] || 'Bienvenido'}! 👋
        </motion.h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: 14 }}>Así va tu tienda hoy</p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        {!stats && kpiConfig.map((kpi, i) => (
          <div key={i} className="card" style={{ height: 100 }}>
            <div style={{ height: 16, width: '60%', background: '#e5e7eb', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
            <div style={{ height: 28, width: '40%', background: '#e5e7eb', borderRadius: 4, marginTop: 12, animation: 'pulse 1.5s infinite' }} />
          </div>
        ))}
        {stats && kpiConfig.map((kpi, i) => (
          <motion.div
            key={kpi.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="card"
            style={{ borderTop: `3px solid ${kpi.color}` }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{kpi.label}</p>
                <p style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginTop: 4 }}>
                  {kpi.format ? kpi.format(stats[kpi.key]) : (stats[kpi.key] || 0)}
                </p>
              </div>
              <span style={{ fontSize: 28 }}>{kpi.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Categorías */}
      {stats?.productsByCategory && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Productos por Categoría</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
            {stats.productsByCategory.map(cat => (
              <div key={cat.name} style={{ textAlign: 'center', padding: 16, background: 'var(--color-primary-bg)', borderRadius: 'var(--radius-md)' }}>
                <p style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-primary)' }}>{cat.count}</p>
                <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>{cat.name}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </Layout>
  );
}
