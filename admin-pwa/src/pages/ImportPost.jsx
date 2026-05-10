import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function ImportPost() {
  const [platform, setPlatform] = useState('instagram');
  const [postUrl, setPostUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [importedPosts, setImportedPosts] = useState([]);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  const handleImport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/social/import', { platform, postUrl, caption });
      setMessage('¡Post importado exitosamente!');
      setMessageType('success');
      setImportedPosts([res.data.post, ...importedPosts]);
      setPostUrl('');
      setCaption('');
    } catch (err) {
      setMessage('Error al importar: ' + (err.response?.data?.message || 'Verifica la URL'));
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    { id: 'instagram', label: 'Instagram', icon: '📷', color: '#E1306C' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵', color: '#000000' },
    { id: 'facebook', label: 'Facebook', icon: '📘', color: '#1877F2' },
    { id: 'twitter', label: 'Twitter', icon: '🐦', color: '#1DA1F2' }
  ];

  return (
    <Layout user={user}>
      <div className="animate-fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ marginBottom: 24 }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>📥 Importar Post</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 14, marginBottom: 24 }}>
            Convierte tus publicaciones de redes sociales en productos de tu tienda
          </p>

          {message && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--radius-md)',
                marginBottom: 16,
                fontSize: 14,
                background: messageType === 'success' ? 'var(--color-success-bg)' : 'var(--color-error-bg)',
                color: messageType === 'success' ? 'var(--color-success)' : 'var(--color-error)'
              }}
            >
              {messageType === 'success' ? '✅' : '❌'} {message}
            </motion.div>
          )}

          <form onSubmit={handleImport}>
            {/* Selector de plataforma */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 8 }}>Plataforma</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {platforms.map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPlatform(p.id)}
                    style={{
                      padding: '12px 8px',
                      border: platform === p.id ? `2px solid ${p.color}` : '2px solid #e5e7eb',
                      borderRadius: 'var(--radius-md)',
                      background: platform === p.id ? `${p.color}10` : '#fff',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.2s'
                    }}
                  >
                    <span style={{ fontSize: 20, display: 'block' }}>{p.icon}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, marginTop: 4, display: 'block' }}>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* URL del post */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>URL del Post</label>
              <input
                type="url"
                value={postUrl}
                onChange={e => setPostUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 14,
                  outline: 'none',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s'
                }}
                onFocus={e => e.target.style.borderColor = '#4f46e5'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                placeholder="https://instagram.com/p/..."
                required
              />
            </div>

            {/* Descripción */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 6 }}>Descripción (opcional)</label>
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 14,
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: 80,
                  boxSizing: 'border-box',
                  fontFamily: 'inherit'
                }}
                onFocus={e => e.target.style.borderColor = '#4f46e5'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                placeholder="Describe el producto..."
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 15,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 10px 25px rgba(79,70,229,0.3)'
              }}
            >
              {loading ? '⏳ Importando...' : '📥 Importar Post'}
            </motion.button>
          </form>
        </motion.div>

        {/* Posts importados */}
        {importedPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card"
          >
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Posts Importados ({importedPosts.length})</h3>
            <div style={{ display: 'grid', gap: 12 }}>
              {importedPosts.map(post => (
                <div key={post.id} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 12,
                  background: 'var(--color-bg)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)'
                }}>
                  <div>
                    <span className="badge" style={{ background: '#eef2ff', color: '#4f46e5', marginRight: 8 }}>
                      {post.platform}
                    </span>
                    <span style={{ fontSize: 14 }}>{post.caption?.substring(0, 50) || 'Sin descripción'}</span>
                  </div>
                  <a href="/posts" style={{ color: '#4f46e5', textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>
                    Gestionar →
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
