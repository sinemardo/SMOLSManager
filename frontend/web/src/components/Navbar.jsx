import { useState } from 'react';

export default function Navbar({ user, cartCount, wishlistCount, onShowCart, onShowWishlist, onShowPortal, onLogout, onShowAuth, onSetAuthMode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
      <span style={{ fontWeight: 700, fontSize: 20, color: '#6366f1' }}>SMOLS</span>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {user ? (
          <>
            {/* Botones de acceso rápido */}
            <button onClick={onShowWishlist} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', position: 'relative' }}>
              ❤️ {wishlistCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{wishlistCount}</span>}
            </button>
            <button onClick={onShowCart} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', position: 'relative' }}>
              🛒 {cartCount > 0 && <span style={{ position: 'absolute', top: -6, right: -6, background: '#dc2626', color: '#fff', fontSize: 10, fontWeight: 700, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cartCount}</span>}
            </button>

            {/* Avatar circular */}
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: '#6366f1', color: '#fff', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </button>

            {/* Menú hamburguesa */}
            <div style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', padding: '4px 8px' }}>☰</button>
              
              {menuOpen && (
                <div style={{ position: 'absolute', top: 40, right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: 8, minWidth: 200, zIndex: 500 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#1f2937' }}>{user.name}</p>
                    <p style={{ fontSize: 12, color: '#64748b' }}>{user.email}</p>
                  </div>
                  <button onClick={() => { onShowPortal(); setMenuOpen(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', border: 'none', borderRadius: 8, background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, color: '#374151' }}>👤 Mi Portal</button>
                  <button onClick={() => { onShowWishlist(); setMenuOpen(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', border: 'none', borderRadius: 8, background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, color: '#374151' }}>❤️ Favoritos</button>
                  <button onClick={() => { onShowCart(); setMenuOpen(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', border: 'none', borderRadius: 8, background: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 14, color: '#374151' }}>🛒 Carrito</button>
                  <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />
                  <button onClick={() => { onLogout(); setMenuOpen(false); }} style={{ display: 'block', width: '100%', padding: '10px 16px', border: 'none', borderRadius: 8, background: '#fef2f2', color: '#dc2626', cursor: 'pointer', textAlign: 'left', fontSize: 14 }}>🚪 Cerrar sesión</button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button onClick={() => { onShowAuth(); onSetAuthMode('login'); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Iniciar sesión</button>
            <button onClick={() => { onShowAuth(); onSetAuthMode('register'); }} style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>Comenzar a vender</button>
          </>
        )}
      </div>
    </nav>
  );
}
