import { motion } from 'framer-motion';

export default function Layout({ children, user }) {
  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/catalog', label: 'Catálogo', icon: '📦' },
    { href: '/import', label: 'Importar', icon: '📥' },
    { href: '/posts', label: 'Posts', icon: '📋' },
    { href: '/profile', label: 'Tienda', icon: '🏪' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '0 24px'
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden' }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, marginRight: 16, flexShrink: 0 }}>
              <span style={{ fontSize: 22 }}>🏪</span>
              <span style={{ fontWeight: 700, fontSize: 16, background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SMOLS</span>
            </a>
            <div style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
              {navItems.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontSize: 13,
                    fontWeight: 500,
                    color: window.location.pathname === item.href ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    background: window.location.pathname === item.href ? 'var(--color-primary-bg)' : 'transparent',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s'
                  }}
                >
                  {item.icon} {item.label}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--color-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 12, color: 'var(--color-primary)' }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontWeight: 500, display: 'none' }} className="desktop-name">{user.name}</span>
              </div>
            )}
            <button onClick={logout} style={{ background: 'none', border: '1px solid var(--color-border)', padding: '6px 14px', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-secondary)' }}>
              Salir
            </button>
          </div>
        </div>
      </motion.nav>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 16px' }}>
        {children}
      </main>
    </div>
  );
}
