import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

const statusConfig = {
  pending:   { label: 'Pendiente', color: '#d97706', bg: '#fffbeb' },
  confirmed: { label: 'Confirmado', color: '#2563eb', bg: '#eff6ff' },
  shipped:   { label: 'Enviado', color: '#ea580c', bg: '#fff7ed' },
  delivered: { label: 'Completado', color: '#059669', bg: '#ecfdf5' },
  cancelled: { label: 'Cancelado', color: '#dc2626', bg: '#fef2f2' },
  returned:  { label: 'Devuelto', color: '#7c3aed', bg: '#f5f3ff' }
};

export default function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadOrders(filter);
  }, [filter]);

  async function loadOrders(statusFilter) {
    setLoading(true);
    try {
      const token = localStorage.getItem('smols_token');
      const params = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
      const res = await axios.get(API + '/orders' + params, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setOrders(res.data.orders || []);
    } catch (err) {
      setMessage('Error al cargar pedidos');
    } finally { setLoading(false); }
  }

  async function handleStatusChange(orderId, newStatus) {
    try {
      const token = localStorage.getItem('smols_token');
      await axios.patch(API + '/orders/' + orderId + '/status', { status: newStatus }, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMessage('✅ Estado actualizado');
      loadOrders(filter); // recargar
    } catch (err) {
      setMessage('❌ Error: ' + (err.response?.data?.message || 'No se pudo actualizar'));
    }
  }

  const filterTabs = [
    { id: 'all', label: 'Todos' },
    { id: 'pending', label: 'Pendientes' },
    { id: 'delivered', label: 'Completados' },
    { id: 'cancelled', label: 'Cancelados' },
    { id: 'returned', label: 'Devueltos' }
  ];

  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>📋 Historial de Pedidos</h2>
      {message && (
        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: message.includes('✅') ? '#ecfdf5' : '#fef2f2', color: message.includes('✅') ? '#059669' : '#dc2626', fontSize: 14 }}>
          {message}
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {filterTabs.map(tab => (
          <button key={tab.id} onClick={() => setFilter(tab.id)}
            style={{
              padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontWeight: 600, fontSize: 13,
              background: filter === tab.id ? '#6366f1' : '#f1f5f9',
              color: filter === tab.id ? '#fff' : '#475569'
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', padding: 40 }}>Cargando pedidos...</p>
      ) : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#f8fafc', borderRadius: 16 }}>
          <span style={{ fontSize: 48 }}>📭</span>
          <p style={{ color: '#64748b', marginTop: 12 }}>No hay pedidos en este estado</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {orders.map(order => (
            <div key={order.id} style={{ padding: 20, borderRadius: 16, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>Pedido #{order.id?.substring(0, 8)}</span>
                  <span style={{ marginLeft: 12, fontSize: 12, color: '#64748b' }}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span style={{
                  padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                  background: statusConfig[order.status]?.bg, color: statusConfig[order.status]?.color
                }}>
                  {statusConfig[order.status]?.label}
                </span>
              </div>

              <div style={{ marginBottom: 12 }}>
                {order.items?.map(item => (
                  <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f1f5f9', fontSize: 14 }}>
                    <span>{item.product?.name} x{item.quantity}</span>
                    <span style={{ fontWeight: 500 }}>€{(item.price * item.quantity)?.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#6366f1' }}>
                  Total: €{order.totalAmount?.toFixed(2)}
                </span>

                {/* Botones de acción según estado */}
                <div style={{ display: 'flex', gap: 8 }}>
                  {order.status === 'pending' && (
                    <button onClick={() => handleStatusChange(order.id, 'cancelled')}
                      style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: '#fef2f2', color: '#dc2626', fontWeight: 600, fontSize: 13 }}>
                      Cancelar
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button onClick={() => handleStatusChange(order.id, 'returned')}
                      style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                        background: '#f5f3ff', color: '#7c3aed', fontWeight: 600, fontSize: 13 }}>
                      Devolver
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
