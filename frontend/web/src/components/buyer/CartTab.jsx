export default function CartTab({ cart, setCart, updateCartQty, removeFromCart, moveToWishlist, cartTotal, onCheckout }) {
  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>🛒 Mi Carrito</h2>
        {cart.length > 0 && <button onClick={() => setCart([])} style={{ padding: '8px 16px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Vaciar</button>}
      </div>
      {cart.length === 0 ? <div style={{ textAlign: 'center', padding: 40 }}><span style={{ fontSize: 48 }}>🛒</span><p style={{ color: '#64748b', marginTop: 12 }}>Carrito vacío</p></div> : (
        <>
          {cart.map(item => (
            <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ flex: 1 }}><p style={{ fontWeight: 600 }}>{item.name}</p><p style={{ color: '#6366f1', fontWeight: 700 }}>€{item.price}</p></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => updateCartQty(item.productId, (item.quantity || 1) - 1)} style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>−</button>
                <span style={{ fontWeight: 600 }}>{item.quantity || 1}</span>
                <button onClick={() => updateCartQty(item.productId, (item.quantity || 1) + 1)} style={{ width: 28, height: 28, border: '1px solid #e2e8f0', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>+</button>
                <button onClick={() => moveToWishlist(item)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>❤️</button>
                <button onClick={() => removeFromCart(item.productId)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20, padding: '16px 0', borderTop: '2px solid #e2e8f0' }}>
            <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}>€{cartTotal.toFixed(2)}</span>
          </div>
          <button onClick={onCheckout} style={{ width: "100%", marginTop: 16, padding: "14px", background: "#059669", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Realizar Pedido</button>
        </>
      )}
    </div>
  );
}

