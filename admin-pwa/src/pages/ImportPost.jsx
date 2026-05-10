import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function ImportPost() {
  const [platform, setPlatform] = useState('instagram');
  const [caption, setCaption] = useState('');
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  const addImage = () => {
    if (images.length >= 6) {
      setMessage('Máximo 6 imágenes');
      setMessageType('error');
      return;
    }
    const url = prompt('URL de la imagen (ej: https://picsum.photos/400/400):');
    if (url) {
      setImages([...images, { url, alt: caption || 'Producto' }]);
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleImport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/social/import', { 
        platform, 
        postUrl: 'https://' + platform + '.com/p/' + Date.now(),
        caption,
        images: images.length > 0 ? images : [{ url: 'https://picsum.photos/400/400', alt: caption }]
      });
      setMessage('¡Post importado exitosamente!');
      setMessageType('success');
      setCaption('');
      setImages([]);
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Verifica los datos'));
      setMessageType('error');
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
      <div style={{maxWidth:700,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="card" style={{marginBottom:24}}>
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:8}}>📥 Importar Post</h2>
          <p style={{color:'#6b7280',fontSize:14,marginBottom:24}}>Crea un post con imágenes para publicar en redes sociales</p>

          {message && (
            <motion.div initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
              style={{padding:'12px 16px',borderRadius:8,marginBottom:16,fontSize:14,
                background: messageType==='success'?'#ecfdf5':'#fef2f2',color: messageType==='success'?'#059669':'#dc2626'}}>
              {messageType==='success'?'✅':'❌'} {message}
            </motion.div>
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

            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:6}}>Descripción</label>
              <textarea value={caption} onChange={e=>setCaption(e.target.value)} rows={4}
                style={{width:'100%',padding:'12px 16px',border:'2px solid #e5e7eb',borderRadius:8,fontSize:14,outline:'none',resize:'vertical',fontFamily:'inherit',boxSizing:'border-box'}}
                placeholder="Describe tu producto..." />
            </div>

            {/* Imágenes */}
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:8}}>
                Imágenes ({images.length}/6)
              </label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(100px, 1fr))',gap:8,marginBottom:12}}>
                {images.map((img, i) => (
                  <div key={i} style={{position:'relative',borderRadius:8,overflow:'hidden',height:100}}>
                    <img src={img.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    <button onClick={()=>removeImage(i)}
                      style={{position:'absolute',top:4,right:4,background:'rgba(220,38,38,0.9)',color:'#fff',border:'none',width:22,height:22,borderRadius:'50%',cursor:'pointer',fontSize:12}}>✕</button>
                  </div>
                ))}
                {images.length < 6 && (
                  <button type="button" onClick={addImage}
                    style={{height:100,border:'2px dashed #d1d5db',borderRadius:8,background:'#f9fafb',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:24,color:'#9ca3af'}}>
                    +
                  </button>
                )}
              </div>
            </div>

            <motion.button whileTap={{scale:0.98}} type="submit" disabled={loading}
              style={{width:'100%',padding:'14px',background: loading?'#9ca3af':'linear-gradient(135deg,#4f46e5,#7c3aed)',color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:600,cursor: loading?'not-allowed':'pointer'}}>
              {loading?'⏳ Importando...':'📥 Importar Post'}
            </motion.button>
          </form>
        </motion.div>

        {/* Botón para publicar en redes */}
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="card" style={{textAlign:'center'}}>
          <h3 style={{fontSize:18,fontWeight:600,marginBottom:8}}>🚀 ¿Ya tienes un producto?</h3>
          <p style={{color:'#6b7280',fontSize:14,marginBottom:16}}>Publícalo directamente en todas tus redes sociales</p>
          <a href="/catalog" style={{display:'inline-block',padding:'10px 24px',background:'#4f46e5',color:'#fff',textDecoration:'none',borderRadius:8,fontWeight:600}}>Ir al Catálogo</a>
        </motion.div>
      </div>
    </Layout>
  );
}
