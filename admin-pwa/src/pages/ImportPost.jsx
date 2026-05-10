import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function ImportPost() {
  const [platform, setPlatform] = useState('instagram');
  const [postUrl, setPostUrl] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  const handleImport = async (e) => {
    e.preventDefault();
    if (!postUrl.trim()) {
      setMessage('La URL del post es obligatoria');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await api.post('/social/import', { platform, postUrl });
      setMessage('¡Post importado exitosamente!');
      setPostUrl('');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Verifica la URL'));
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    { id: 'instagram', label: 'Instagram', icon: '📷' },
    { id: 'tiktok', label: 'TikTok', icon: '🎵' },
    { id: 'facebook', label: 'Facebook', icon: '📘' },
    { id: 'twitter', label: 'Twitter', icon: '🐦' }
  ];

  return (
    <Layout user={user}>
      <div style={{maxWidth:600,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="card">
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:4}}>📥 Importar desde Red Social</h2>
          <p style={{color:'#6b7280',fontSize:14,marginBottom:24}}>Pega la URL de tu post de Instagram, TikTok, Facebook o Twitter</p>

          {message && (
            <div style={{padding:'12px 16px',borderRadius:8,marginBottom:16,fontSize:14,
              background: message.includes('Error')?'#fef2f2':'#ecfdf5',color: message.includes('Error')?'#dc2626':'#059669'}}>
              {message}
            </div>
          )}

          <form onSubmit={handleImport}>
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:8}}>Plataforma</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
                {platforms.map(p => (
                  <button key={p.id} type="button" onClick={()=>setPlatform(p.id)}
                    style={{padding:'12px 8px',border: platform===p.id?'2px solid #4f46e5':'2px solid #e5e7eb',borderRadius:8,background: platform===p.id?'#eef2ff':'#fff',cursor:'pointer',textAlign:'center',transition:'all 0.2s'}}>
                    <span style={{fontSize:20,display:'block'}}>{p.icon}</span>
                    <span style={{fontSize:11,fontWeight:500,marginTop:4,display:'block'}}>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div style={{marginBottom:24}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:6}}>URL del Post *</label>
              <input type="url" value={postUrl} onChange={e=>setPostUrl(e.target.value)}
                style={{width:'100%',padding:'12px 16px',border:'2px solid #e5e7eb',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box'}}
                placeholder="https://instagram.com/p/..." required />
            </div>

            <motion.button whileTap={{scale:0.98}} type="submit" disabled={loading}
              style={{width:'100%',padding:'14px',background: loading?'#9ca3af':'linear-gradient(135deg,#4f46e5,#7c3aed)',color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:600,cursor: loading?'not-allowed':'pointer'}}>
              {loading?'⏳ Importando...':'📥 Importar Post'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
