import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    api.get('/kpis/dashboard').then(r => setStats(r.data.kpis)).catch(() => {});
  }, []);

  const logout = () => {
    localStorage.removeItem('smols_token');
    localStorage.removeItem('smols_user');
    window.location.href = '/login';
  };

  if (!stats) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">SMOLSManager</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/posts')} className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg">Gestionar Posts</button>
            <button onClick={() => navigate('/import')} className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg">+ Importar</button>
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button onClick={logout} className="text-sm text-red-500">Salir</button>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Productos</p><p className="text-2xl font-bold">{stats.totalProducts}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Ordenes</p><p className="text-2xl font-bold">{stats.ordersToday}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Ingresos</p><p className="text-2xl font-bold">€{(stats.totalRevenue || 0).toFixed(2)}</p></div>
          <div className="bg-white p-4 rounded-lg shadow"><p className="text-sm text-gray-500">Vendedores</p><p className="text-2xl font-bold">{stats.activeSellers}</p></div>
        </div>
      </main>
    </div>
  );
}
