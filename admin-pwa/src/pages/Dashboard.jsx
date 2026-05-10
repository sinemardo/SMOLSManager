import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNotifications } from '../hooks/useNotifications';
import api from '../services/api';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('smols_token');

  useNotifications(user?.id, token);

  useEffect(() => {
    loadData();
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const loadData = async () => {
    try {
      const [dashRes] = await Promise.all([
        api.get('/kpis/dashboard')
      ]);
      setStats(dashRes.data.kpis);
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  if (!stats) return <div className="flex h-screen items-center justify-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">SMOLSManager</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/import')} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200">
              Importar Post
            </button>
            <span className="text-sm text-gray-600">{user?.name}</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">{user?.role}</span>
            <button onClick={logout} className="text-sm text-red-500 hover:text-red-700">Salir</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard de {user?.storeName || user?.name}</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Productos</p>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Ordenes Hoy</p>
            <p className="text-2xl font-bold">{stats.ordersToday}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Ingresos</p>
            <p className="text-2xl font-bold">€{stats.totalRevenue?.toFixed(2) || '0.00'}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Vendedores</p>
            <p className="text-2xl font-bold">{stats.activeSellers}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Productos por Categoria</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats.productsByCategory} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                  {stats.productsByCategory?.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Notificaciones</h3>
            <div className="space-y-2">
              {notifications.length === 0 && (
                <p className="text-gray-400 text-sm">No hay notificaciones nuevas</p>
              )}
              {notifications.map((n, i) => (
                <div key={i} className="p-3 bg-indigo-50 rounded-lg text-sm">
                  {n.message}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Ordenes Recientes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Comprador</th>
                  <th className="text-left py-2">Total</th>
                  <th className="text-left py-2">Estado</th>
                  <th className="text-left py-2">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentOrders?.map(order => (
                  <tr key={order.id} className="border-b">
                    <td className="py-2">{order.buyer?.name}</td>
                    <td className="py-2">€{order.totalAmount?.toFixed(2)}</td>
                    <td className="py-2">
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">{order.status}</span>
                    </td>
                    <td className="py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
