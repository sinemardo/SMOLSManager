export default function WishlistTab({ wishlist, addToCartFromWishlist, removeFromWishlist }) {
  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>❤️ Mis Favoritos ({wishlist.length})</h2>
      {wishlist.length === 0 ? <div style={{ textAlign: 'center', padding: 40 }}><span style={{ fontSize: 48 }}>❤️</span><p style={{ color: '#64748b', marginTop: 12 }}>No tienes favoritos</p></div> : (
        wishlist.map(item => (
          <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
            <div><p style={{ fontWeight: 600 }}>{item.name}</p><p style={{ color: '#6366f1', fontWeight: 700 }}>€{item.price}</p></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => addToCartFromWishlist(item)} style={{ padding: '8px 14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>🛒</button>
              <button onClick={() => removeFromWishlist(item.productId)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
