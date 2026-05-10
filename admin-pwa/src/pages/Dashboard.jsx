import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Skeleton, { DashboardSkeleton } from '../components/ui/Skeleton';
import ProgressBar from '../components/ui/ProgressBar';
import ToastProvider from '../components/ui/Toast';
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    api.get('/kpis/dashboard')
      .then(r => setStats(r.data.kpis))
      .catch(() => toast.error('Error al cargar el dashboard'))
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.clear();
    toast.success('¡Hasta pronto!');
    setTimeout(() => { window.location.href = '/login'; }, 500);
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <>
      <ToastProvider />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Navbar */}
        <motion.nav
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50"
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏪</span>
              <h1 className="text-lg font-bold text-gray-900">SMOLSManager</h1>
            </div>
            <div className="flex items-center gap-3">
              <a href="/import">
                <Button variant="secondary" size="sm" icon={<span>+</span>}>
                  Importar Post
                </Button>
              </a>
              <span className="text-sm text-gray-600 hidden sm:block">{user?.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Salir
              </Button>
            </div>
          </div>
        </motion.nav>

        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Bienvenida */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              ¡Hola{user?.name ? ', ' + user.name.split(' ')[0] : ''}! 👋
            </h2>
            <p className="text-gray-500 mt-1">Así va tu tienda hoy</p>
          </motion.div>

          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Productos', value: stats.totalProducts, color: 'from-indigo-500 to-indigo-600', icon: '📦' },
              { label: 'Órdenes Hoy', value: stats.ordersToday, color: 'from-green-500 to-green-600', icon: '📋' },
              { label: 'Ingresos', value: '€' + (stats.totalRevenue || 0).toFixed(2), color: 'from-amber-500 to-amber-600', icon: '💰' },
              { label: 'Vendedores', value: stats.activeSellers, color: 'from-purple-500 to-purple-600', icon: '👥' }
            ].map((kpi, i) => (
              <motion.div
                key={kpi.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{kpi.label}</p>
                      <p className="text-xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                    </div>
                    <span className="text-2xl">{kpi.icon}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Grid de contenido */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Categorías */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Productos por Categoría</h3>
                {stats.productsByCategory?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.productsByCategory.map(cat => {
                      const total = stats.productsByCategory.reduce((s, c) => s + c.count, 0);
                      const pct = total > 0 ? (cat.count / total) * 100 : 0;
                      return (
                        <div key={cat.name}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">{cat.name}</span>
                            <span className="font-medium text-gray-900">{cat.count}</span>
                          </div>
                          <ProgressBar value={pct} color="indigo" showPercentage={false} />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <EmptyState
                    icon="📂"
                    title="Sin categorías aún"
                    description="Las categorías aparecerán cuando agregues productos"
                  />
                )}
              </Card>
            </motion.div>

            {/* Órdenes recientes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Órdenes Recientes</h3>
                {stats.recentOrders?.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentOrders.map(order => (
                      <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div>
                          <p className="text-sm font-medium">{order.buyer?.name || 'Cliente'}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-green-600">€{order.totalAmount?.toFixed(2)}</p>
                          <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon="📭"
                    title="No hay órdenes"
                    description="Las órdenes aparecerán cuando alguien compre tus productos"
                  />
                )}
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
}
