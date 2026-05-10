import { useState } from 'react';
import api from '../services/api';

export default function ImportPost() {
  const [platform, setPlatform] = useState('instagram');
  const [postUrl, setPostUrl] = useState('');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      await api.post('/social/import', { platform, postUrl });
      setMessage('Post importado!');
    } catch (err) {
      setMessage('Error al importar');
    }
  };

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb'}}>
      <nav style={{background:'#fff',padding:'12px 24px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <a href="/" style={{color:'#4f46e5',textDecoration:'none',fontWeight:700}}>← Dashboard</a>
      </nav>
      <main style={{maxWidth:600,margin:'0 auto',padding:32}}>
        <h2 style={{fontSize:24,fontWeight:700,marginBottom:24}}>Importar Post</h2>
        {message && <div style={{padding:12,borderRadius:8,marginBottom:16,background:'#eef2ff',color:'#4f46e5'}}>{message}</div>}
        <form onSubmit={handleImport} style={{background:'#fff',padding:24,borderRadius:12,boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <select value={platform} onChange={e=>setPlatform(e.target.value)} style={{width:'100%',padding:12,border:'1px solid #d1d5db',borderRadius:8,marginBottom:12}}>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="facebook">Facebook</option>
          </select>
          <input type="text" value={postUrl} onChange={e=>setPostUrl(e.target.value)} style={{width:'100%',padding:12,border:'1px solid #d1d5db',borderRadius:8,marginBottom:16,boxSizing:'border-box'}} placeholder="URL del post" required />
          <button type="submit" style={{width:'100%',padding:12,background:'#4f46e5',color:'#fff',border:'none',borderRadius:8,fontSize:16,cursor:'pointer'}}>Importar Post</button>
        </form>
      </main>
    </div>
  );
}
