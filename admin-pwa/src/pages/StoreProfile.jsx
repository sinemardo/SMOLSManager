import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function StoreProfile() {
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');
  const [profile, setProfile] = useState({
    name: user.storeName || user.name || '',
    description: '',
    category: user.category || '',
    instagram: '',
    tiktok: '',
    facebook: ''
  });
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('profile');
  const [completion, setCompletion] = useState(0);

  const calculateCompletion = (p) => {
    let score = 0;
    if (p.name) score += 20;
    if (p.description) score += 20;
    if (p.instagram || p.tiktok || p.facebook) score += 20;
    if (p.category) score += 20;
    score += 20; // base
    return Math.min(100, score);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', profile);
      setMessage('Perfil actualizado correctamente');
    } catch (err) {
      setMessage('Error al actualizar');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Información', icon: '📝' },
    { id: 'preview', label: 'Vista Previa', icon: '👁️' },
    { id: 'metrics', label: 'Métricas', icon: '📊' }
  ];

  return (
    <Layout user={user}>
      <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto' }}>
        {/* Cabecera */}
        <div style={{
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          borderRadius: 'var(--radius-xl)',
          padding: '40px 32px',
          marginBottom: 24,
          color: '#fff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{
                width: 80, height: 80, borderRadius: 'var(--radius-lg)', background: 'rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36
              }}>
                🏪
              </div>
              <div>
                <h1 style={{ fontSize: 28, fontWeight: 700 }}>{user.storeName || user.name}</h1>
                <p style={{ opacity: 0.8, marginTop: 4 }}>{user.email}</p>
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13 }}>Perfil completado</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{completion}%</span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.3)', borderRadius: 3, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: completion + '%' }}
                  transition={{ duration: 1 }}
                  style={{ height: '100%', background: '#fff', borderRadius: 3 }}
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#fff', borderRadius: 'var(--radius-lg)', padding: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              style={{
                flex: 1,
                padding: '12px',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: activeSection === tab.id ? 'var(--color-primary-bg)' : 'transparent',
                color: activeSection === tab.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: 14,
                transition: 'all 0.2s'
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        {activeSection === 'profile' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card">
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>📝 Información de la Tienda</h3>
            {message && (
              <div style={{ padding: '12px 16px', borderRadius: 'var(--radius-md)', marginBottom: 16, background: message.includes('Error') ? 'var(--color-error-bg)' : 'var(--color-success-bg)', color: message.includes('Error') ? 'var(--color-error)' : 'var(--color-success)', fontSize: 14 }}>
                {message}
              </div>
            )}
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Nombre de la Tienda</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: 'var(--radius-md)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Descripción</label>
                  <textarea value={profile.description} onChange={e => setProfile({ ...profile, description: e.target.value })} rows={4} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: 'var(--radius-md)', fontSize: 14, outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }} placeholder="Describe tu tienda..." />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Instagram</label>
                    <input type="text" value={profile.instagram} onChange={e => setProfile({ ...profile, instagram: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: 'var(--radius-md)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder="@usuario" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>TikTok</label>
                    <input type="text" value={profile.tiktok} onChange={e => setProfile({ ...profile, tiktok: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: 'var(--radius-md)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder="@usuario" />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Facebook</label>
                    <input type="text" value={profile.facebook} onChange={e => setProfile({ ...profile, facebook: e.target.value })} style={{ width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb', borderRadius: 'var(--radius-md)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }} placeholder="facebook.com/..." />
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.98 }} type="submit" style={{ padding: '14px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: '#fff', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 600, cursor: 'pointer', boxShadow: '0 5px 15px rgba(79,70,229,0.3)' }}>
                  💾 Guardar Cambios
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {activeSection === 'preview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card" style={{ textAlign: 'center', padding: 40 }}>
            <span style={{ fontSize: 64 }}>🏪</span>
            <h3 style={{ fontSize: 24, fontWeight: 700, marginTop: 16 }}>{profile.name || 'Tu Tienda'}</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>{profile.description || 'Añade una descripción'}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20 }}>
              {profile.instagram && <span>📷 @{profile.instagram}</span>}
              {profile.tiktok && <span>🎵 @{profile.tiktok}</span>}
              {profile.facebook && <span>📘 {profile.facebook}</span>}
            </div>
          </motion.div>
        )}

        {activeSection === 'metrics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              {[
                { label: 'Productos Activos', value: '0', icon: '📦' },
                { label: 'Ventas Totales', value: '0', icon: '💰' },
                { label: 'Vistas', value: '0', icon: '👁️' },
                { label: 'Tasa Conversión', value: '0%', icon: '📈' }
              ].map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card" style={{ textAlign: 'center' }}>
                  <span style={{ fontSize: 32 }}>{m.icon}</span>
                  <p style={{ fontSize: 24, fontWeight: 700, marginTop: 8 }}>{m.value}</p>
                  <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{m.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
