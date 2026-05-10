import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Layout({ children, user }) {
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
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
            <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
              {navItems.map(item => (
                <a key={item.href} href={item.href} style={{ padding: '8px 12px', borderRadius: 8, textDecoration: 'none', fontSize: 13, fontWeight: 500, color: currentPath === item.href ? '#4f46e5' : '#6b7280', background: currentPath === item.href ? '#eef2ff' : 'transparent', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>
                  {item.icon} {item.label}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: '#6b7280' }}>{user?.name?.split(' ')[0]}</span>
            <button onClick={logout} style={{ background: 'none', border: '1px solid #e5e7eb', padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 13, color: '#6b7280' }}>Salir</button>
          </div>
        </div>
      </motion.nav>
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>{children}</main>
    </div>
  );
}
