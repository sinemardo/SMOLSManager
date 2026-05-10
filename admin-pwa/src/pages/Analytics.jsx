import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import Layout from '../components/layout/Layout';
import api from '../services/api';

const COLORS = ['#4f46e5', '#7c3aed', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#14b8a6'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState('week');
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      const [dashRes, funnelRes] = await Promise.all([
        api.get('/kpis/dashboard'),
        api.get('/kpis/funnel')
      ]);
      setData({
        kpis: dashRes.data.kpis,
        funnel: funnelRes.data.funnel || []
      });
    } catch (err) {
      console.error('Error cargando analytics');
    }
  };

  // Datos simulados para gráficos de tendencia
  const trendData = [
    { name: 'Lun', productos: 4, ordenes: 2, ingresos: 150 },
    { name: 'Mar', productos: 3, ordenes: 5, ingresos: 320 },
    { name: 'Mie', productos: 7, ordenes: 3, ingresos: 210 },
    { name: 'Jue', productos: 5, ordenes: 6, ingresos: 450 },
    { name: 'Vie', productos: 8, ordenes: 4, ingresos: 280 },
    { name: 'Sab', productos: 2, ordenes: 7, ingresos: 520 },
    { name: 'Dom', productos: 6, ordenes: 2, ingresos: 180 }
  ];

  const platformData = [
    { name: 'Instagram', value: 45 },
    { name: 'TikTok', value: 30 },
    { name: 'Facebook', value: 15 },
    { name: 'Twitter', value: 10 }
  ];

  if (!data) return (
    <Layout user={user}>
      <div style={{ textAlign: 'center', padding: 80 }}>
        <div style={{ width: 48, height: 48, border: '4px solid #e5e7eb', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
      </div>
    </Layout>
  );

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>📊 Analytics</h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Análisis detallado de tu tienda</p>
          </div>
          <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 10, padding: 4 }}>
            {['week', 'month', 'year'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: 8,
                  background: period === p ? '#4f46e5' : 'transparent',
                  color: period === p ? '#fff' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500
                }}
              >
                {p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Productos', value: data.kpis?.totalProducts || 0, change: '+12%', icon: '📦', color: '#4f46e5' },
            { label: 'Órdenes', value: data.kpis?.ordersToday || 0, change: '+8%', icon: '📋', color: '#059669' },
            { label: 'Ingresos', value: '€' + (data.kpis?.totalRevenue || 0).toFixed(2), change: '+15%', icon: '💰', color: '#d97706' },
            { label: 'Conversión', value: '3.2%', change: '+2%', icon: '📈', color: '#7c3aed' }
          ].map((kpi, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <p style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{kpi.label}</p>
                  <p style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginTop: 4 }}>{kpi.value}</p>
                  <span style={{ fontSize: 12, color: '#059669', fontWeight: 500 }}>{kpi.change} vs período anterior</span>
                </div>
                <span style={{ fontSize: 28 }}>{kpi.icon}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Gráficos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, marginBottom: 24 }}>
          {/* Tendencia */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>📈 Tendencia de Ventas</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="ingresos" stroke="#4f46e5" fill="#4f46e520" strokeWidth={2} />
                <Area type="monotone" dataKey="ordenes" stroke="#059669" fill="#05966920" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Plataformas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
          >
            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>📱 Ventas por Plataforma</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={platformData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {platformData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 12 }}>
              {platformData.map((p, i) => (
                <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i] }} />
                  <span style={{ color: '#6b7280' }}>{p.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Embudo de conversión */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 24 }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>🔄 Embudo de Conversión</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'Publicaciones', value: 120, pct: 100, color: '#4f46e5' },
              { label: 'Productos Activos', value: 45, pct: 38, color: '#7c3aed' },
              { label: 'Vistas', value: 890, pct: 50, color: '#a855f7' },
              { label: 'Carritos', value: 67, pct: 8, color: '#d946ef' },
              { label: 'Órdenes', value: 23, pct: 3, color: '#ec4899' }
            ].map((stage, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{stage.label}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: stage.color }}>{stage.value} ({stage.pct}%)</span>
                </div>
                <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: stage.pct + '%' }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    style={{ height: '100%', background: stage.color, borderRadius: 4 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Productos más vistos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>👁️ Productos Más Vistos</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { name: 'iPhone 15 Pro', views: 456, category: 'Electrónica', price: 999 },
              { name: 'Pastel de Chocolate', views: 312, category: 'Repostería', price: 25 },
              { name: 'Zapatillas Deportivas', views: 289, category: 'Moda', price: 89 },
              { name: 'Laptop Gamer', views: 245, category: 'Computación', price: 1299 },
              { name: 'Aceite de Motor', views: 198, category: 'Mecánica', price: 35 }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 4 ? '1px solid #f9fafb' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: '#4f46e5', minWidth: 28 }}>#{i + 1}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</p>
                    <p style={{ fontSize: 12, color: '#6b7280' }}>{item.category}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, color: '#059669' }}>€{item.price}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{item.views} vistas</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
