import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Layout({ children, user }) {
  const [currentPath, setCurrentPath] = useState('/');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
    { href: '/catalog', label: 'Catalogo', icon: '📦' },
    { href: '/orders', label: 'Ordenes', icon: '📋' },
    { href: '/import', label: 'Importar', icon: '📥' },
    { href: '/posts', label: 'Posts', icon: '📝' },
    { href: '/profile', label: 'Tienda', icon: '🏪' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb', position: 'sticky', top: 0, zIndex: 100, padding: '0 16px' }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginRight: 12 }}>
              <span style={{ fontSize: 22 }}>🏪</span>
              <span style={{ fontWeight: 700, fontSize: 16, color: '#4f46e5' }}>SMOLS</span>
            </a>
            <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }} className="desktop-nav">
              {navItems.slice(0, 5).map(item => (
                <a key={item.href} href={item.href} style={{ padding: '8px 10px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 500, color: currentPath === item.href ? '#4f46e5' : '#6b7280', background: currentPath === item.href ? '#eef2ff' : 'transparent', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                  {item.icon}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              {user?.name?.split(' ')[0]} ▾
            </button>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ position: 'absolute', top: 56, right: 16, background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: 8, minWidth: 180, zIndex: 200 }}
                onClick={() => setMenuOpen(false)}
              >
                {navItems.map(item => (
                  <a key={item.href} href={item.href} style={{ display: 'block', padding: '10px 16px', borderRadius: 8, textDecoration: 'none', fontSize: 14, color: currentPath === item.href ? '#4f46e5' : '#374151', background: currentPath === item.href ? '#eef2ff' : 'transparent' }}>
                    {item.icon} {item.label}
                  </a>
                ))}
                <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '8px 0' }} />
                <button onClick={logout} style={{ width: '100%', padding: '10px 16px', border: 'none', borderRadius: 8, background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: 14, textAlign: 'left' }}>
                  🚪 Salir
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.nav>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>{children}</main>
    </div>
  );
}
