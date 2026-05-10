import { motion } from 'framer-motion';

export default function Layout({ children, title, user }) {
  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/import', label: 'Importar', icon: '📥' },
    { href: '/posts', label: 'Posts', icon: '📋' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Navbar */}
      <motion.nav
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          padding: '12px 24px'
        }}
      >
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24 }}>🏪</span>
              <span style={{ fontWeight: 700, fontSize: 18, background: 'linear-gradient(135deg, var(--color-primary), #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>SMOLSManager</span>
            </a>
            <div style={{ display: 'flex', gap: 4 }}>
              {navItems.map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  style={{
                    padding: '6px 16px',
                    borderRadius: 'var(--radius-md)',
                    textDecoration: 'none',
                    fontSize: 14,
                    fontWeight: 500,
                    color: window.location.pathname === item.href ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    background: window.location.pathname === item.href ? 'var(--color-primary-bg)' : 'transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {item.icon} {item.label}
                </a>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {user && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14, color: 'var(--color-primary)' }}>
                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span style={{ fontSize: 14, color: 'var(--color-text-secondary)', fontWeight: 500 }}>{user.name}</span>
              </div>
            )}
            <button
              onClick={logout}
              style={{
                background: 'none',
                border: '1px solid var(--color-border)',
                padding: '6px 16px',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: 13,
                color: 'var(--color-text-secondary)',
                transition: 'all var(--transition-fast)'
              }}
              onMouseEnter={e => { e.target.style.background = 'var(--color-error-bg)'; e.target.style.color = 'var(--color-error)'; e.target.style.borderColor = 'var(--color-error)'; }}
              onMouseLeave={e => { e.target.style.background = 'none'; e.target.style.color = 'var(--color-text-secondary)'; e.target.style.borderColor = 'var(--color-border)'; }}
            >
              Salir
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Contenido */}
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: 'var(--space-xl) var(--space-md)' }}>
        {title && (
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}
          >
            {title}
          </motion.h1>
        )}
        {children}
      </main>
    </div>
  );
}
