export default function OrdersTab({ orders, loading }) {
  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>📋 Historial de Pedidos</h2>
      {loading ? <p style={{ textAlign: 'center', color: '#64748b' }}>Cargando...</p> : orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}><span style={{ fontSize: 48 }}>📭</span><p style={{ color: '#64748b', marginTop: 12 }}>No tienes pedidos aún</p></div>
      ) : (
        orders.map(order => (
          <div key={order.id} style={{ padding: 16, marginBottom: 12, background: '#f9fafb', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>#{order.id?.substring(0, 8)}</span>
              <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: order.status === 'delivered' ? '#ecfdf5' : '#fffbeb', color: order.status === 'delivered' ? '#059669' : '#d97706' }}>{order.status}</span>
            </div>
            {order.items?.map(item => (
              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '4px 0' }}>
                <span>{item.product?.name} x{item.quantity}</span>
                <span>€{(item.price * item.quantity)?.toFixed(2)}</span>
              </div>
            ))}
            <div style={{ textAlign: 'right', marginTop: 8, fontWeight: 700, color: '#6366f1' }}>Total: €{order.totalAmount?.toFixed(2)}</div>
            <div style={{ fontSize: 11, color: '#94a3b8', textAlign: 'right' }}>{new Date(order.createdAt).toLocaleDateString()}</div>
          </div>
        ))
      )}
    </div>
  );
}
