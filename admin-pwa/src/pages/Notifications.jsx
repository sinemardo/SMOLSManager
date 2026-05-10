import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [unreadCount, setUnreadCount] = useState(0);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get('/kpis/notifications');
      const notifs = res.data.notifications || [];
      setNotifications(notifs);
      setUnreadCount(notifs.filter(n => !n.read).length);
    } catch (err) {
      setNotifications(getDemoNotifications());
      setUnreadCount(3);
    }
  };

  const getDemoNotifications = () => [
    { id: 1, type: 'order', title: 'Nueva orden recibida', message: 'Cliente Juan compró iPhone 15 Pro por €999', time: 'Hace 5 min', read: false, icon: '📋', color: '#4f46e5' },
    { id: 2, type: 'post', title: 'Post convertido exitosamente', message: 'Tu post de Instagram se convirtió en producto: Zapatillas Deportivas', time: 'Hace 1 hora', read: false, icon: '📷', color: '#059669' },
    { id: 3, type: 'system', title: 'Bienvenido a SMOLSManager', message: 'Configura tu perfil de tienda para empezar a vender', time: 'Hace 2 horas', read: false, icon: '🏪', color: '#7c3aed' },
    { id: 4, type: 'order', title: 'Orden entregada', message: 'El pedido #1234 fue entregado exitosamente', time: 'Ayer', read: true, icon: '✅', color: '#059669' },
    { id: 5, type: 'alert', title: 'Producto agotado', message: 'Pastel de Chocolate está agotado. Actualiza el stock', time: 'Ayer', read: true, icon: '⚠️', color: '#d97706' }
  ];

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(n => !n.read) 
      : notifications.filter(n => n.type === filter);

  return (
    <Layout user={user}>
      <div className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 700 }}>🔔 Notificaciones</h2>
            <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todas leídas'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={markAllAsRead} style={{ padding: '8px 16px', background: '#eef2ff', color: '#4f46e5', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
              ✅ Marcar todas leídas
            </button>
            <button onClick={clearAll} style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
              🗑️ Limpiar
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'Todas', icon: '📋' },
            { key: 'unread', label: 'No leídas', icon: '🔵' },
            { key: 'order', label: 'Órdenes', icon: '📦' },
            { key: 'post', label: 'Posts', icon: '📷' },
            { key: 'system', label: 'Sistema', icon: '⚙️' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '8px 16px',
                borderRadius: 20,
                border: 'none',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                background: filter === f.key ? '#4f46e5' : '#fff',
                color: filter === f.key ? '#fff' : '#6b7280',
                boxShadow: filter === f.key ? '0 2px 8px rgba(79,70,229,0.3)' : '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              {f.icon} {f.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 16 }}
            >
              <span style={{ fontSize: 48 }}>🔔</span>
              <p style={{ color: '#6b7280', marginTop: 12, fontSize: 16 }}>No hay notificaciones</p>
              <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 4 }}>Estás al día</p>
            </motion.div>
          ) : (
            <div style={{ display: 'grid', gap: 8 }}>
              {filteredNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => markAsRead(notif.id)}
                  style={{
                    background: notif.read ? '#fff' : '#f0f4ff',
                    padding: 16,
                    borderRadius: 12,
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                    borderLeft: notif.read ? '4px solid transparent' : `4px solid ${notif.color}`,
                    transition: 'all 0.2s',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'flex-start'
                  }}
                >
                  <span style={{ fontSize: 24, minWidth: 32 }}>{notif.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ fontWeight: 600, fontSize: 15, color: notif.read ? '#374151' : '#111827' }}>{notif.title}</p>
                      <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{notif.time}</span>
                    </div>
                    <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>{notif.message}</p>
                  </div>
                  {!notif.read && (
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: notif.color, marginTop: 6 }} />
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
