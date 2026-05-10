import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/kpis/dashboard')
      .then(r => setStats(r.data.kpis))
      .catch(e => setError('Error al cargar datos'));
  }, []);

  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  if (error) return <div style={{padding: 40, textAlign: 'center'}}><p style={{color: 'red'}}>{error}</p><button onClick={logout} style={{marginTop: 20, padding: '8px 16px', background: '#4f46e5', color: '#fff', border: 'none', borderRadius: 8}}>Volver al Login</button></div>;
  if (!stats) return <div style={{padding: 40, textAlign: 'center'}}>Cargando dashboard...</div>;

  return (
    <div style={{minHeight: '100vh', background: '#f3f4f6'}}>
      <nav style={{background: '#fff', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
        <h1 style={{fontSize: 20, fontWeight: 700, color: '#4f46e5'}}>SMOLSManager</h1>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <span style={{fontSize: 14, color: '#6b7280'}}>{user?.name || 'Admin'}</span>
          <button onClick={logout} style={{fontSize: 14, color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer'}}>Salir</button>
        </div>
      </nav>

      <main style={{maxWidth: 1200, margin: '0 auto', padding: 32}}>
        <h2 style={{fontSize: 24, fontWeight: 700, marginBottom: 24}}>Dashboard</h2>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32}}>
          <div style={{background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <p style={{fontSize: 14, color: '#6b7280'}}>Productos</p>
            <p style={{fontSize: 28, fontWeight: 700, color: '#4f46e5'}}>{stats.totalProducts}</p>
          </div>
          <div style={{background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <p style={{fontSize: 14, color: '#6b7280'}}>Ordenes Hoy</p>
            <p style={{fontSize: 28, fontWeight: 700, color: '#059669'}}>{stats.ordersToday}</p>
          </div>
          <div style={{background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <p style={{fontSize: 14, color: '#6b7280'}}>Ingresos</p>
            <p style={{fontSize: 28, fontWeight: 700, color: '#d97706'}}>€{(stats.totalRevenue || 0).toFixed(2)}</p>
          </div>
          <div style={{background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
            <p style={{fontSize: 14, color: '#6b7280'}}>Vendedores</p>
            <p style={{fontSize: 28, fontWeight: 700, color: '#7c3aed'}}>{stats.activeSellers}</p>
          </div>
        </div>

        <div style={{background: '#fff', padding: 24, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{fontSize: 18, fontWeight: 600, marginBottom: 16}}>Categorias</h3>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8}}>
            {stats.productsByCategory?.map(cat => (
              <div key={cat.name} style={{padding: 12, background: '#eef2ff', borderRadius: 8, textAlign: 'center'}}>
                <p style={{fontSize: 14, fontWeight: 500, color: '#4f46e5'}}>{cat.name}</p>
                <p style={{fontSize: 20, fontWeight: 700, color: '#4338ca'}}>{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
