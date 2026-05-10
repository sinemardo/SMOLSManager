import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';

export default function Settings() {
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'es',
    autoConvert: false
  });
  const [message, setMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('smols_settings', JSON.stringify(settings));
    setMessage('✅ Configuración guardada correctamente');
    setTimeout(() => setMessage(''), 3000);
  };

  const sections = [
    {
      title: '🔔 Notificaciones',
      items: [
        { key: 'notifications', label: 'Notificaciones push', desc: 'Recibe alertas en tiempo real de nuevas órdenes' },
        { key: 'emailAlerts', label: 'Alertas por email', desc: 'Recibe un correo cuando recibas una orden' }
      ]
    },
    {
      title: '🎨 Apariencia',
      items: [
        { key: 'darkMode', label: 'Modo oscuro', desc: 'Activa el tema oscuro para la interfaz' }
      ]
    },
    {
      title: '🌐 Idioma',
      items: [
        { key: 'language', label: 'Idioma', desc: 'Selecciona el idioma de la plataforma', type: 'select', options: [
          { value: 'es', label: '🇪🇸 Español' },
          { value: 'en', label: '🇬🇧 English' }
        ]}
      ]
    },
    {
      title: '⚙️ Automatización',
      items: [
        { key: 'autoConvert', label: 'Conversión automática', desc: 'Convierte automáticamente los posts importados en productos' }
      ]
    }
  ];

  return (
    <Layout user={user}>
      <div className="animate-fade-in" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700 }}>⚙️ Configuración</h2>
          <p style={{ color: '#6b7280', fontSize: 14, marginTop: 4 }}>Personaliza tu experiencia en SMOLSManager</p>
        </div>

        {message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, background: '#ecfdf5', color: '#059669', fontSize: 14 }}>
            {message}
          </motion.div>
        )}

        <form onSubmit={handleSave}>
          {sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 16 }}
            >
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{section.title}</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                {section.items.map(item => (
                  <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 500, fontSize: 14 }}>{item.label}</p>
                      <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{item.desc}</p>
                    </div>
                    {item.type === 'select' ? (
                      <select
                        value={settings[item.key]}
                        onChange={e => setSettings({ ...settings, [item.key]: e.target.value })}
                        style={{ padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', cursor: 'pointer' }}
                      >
                        {item.options.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <label style={{ position: 'relative', display: 'inline-block', width: 48, height: 26 }}>
                        <input
                          type="checkbox"
                          checked={settings[item.key]}
                          onChange={e => setSettings({ ...settings, [item.key]: e.target.checked })}
                          style={{ opacity: 0, width: 0, height: 0 }}
                        />
                        <span style={{
                          position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                          backgroundColor: settings[item.key] ? '#4f46e5' : '#d1d5db',
                          borderRadius: 26, transition: '0.3s'
                        }}>
                          <span style={{
                            position: 'absolute', height: 20, width: 20, left: settings[item.key] ? 25 : 3,
                            bottom: 3, backgroundColor: '#fff', borderRadius: '50%', transition: '0.3s'
                          }} />
                        </span>
                      </label>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            style={{
              width: '100%', padding: '14px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600,
              cursor: 'pointer', boxShadow: '0 5px 15px rgba(79,70,229,0.3)'
            }}
          >
            💾 Guardar Configuración
          </motion.button>
        </form>

        {/* Información de cuenta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginTop: 24 }}
        >
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>📧 Información de Cuenta</h3>
          <div style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ color: '#6b7280', fontSize: 14 }}>Email</span>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{user.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ color: '#6b7280', fontSize: 14 }}>Rol</span>
              <span style={{ fontWeight: 500, fontSize: 14, background: '#eef2ff', color: '#4f46e5', padding: '2px 10px', borderRadius: 20 }}>{user.role}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
              <span style={{ color: '#6b7280', fontSize: 14 }}>Miembro desde</span>
              <span style={{ fontWeight: 500, fontSize: 14 }}>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
