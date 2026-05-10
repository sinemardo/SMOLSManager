import { useState, useEffect } from 'react';
import api from '../services/api';

export default function PostsManager() {
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    api.get('/social/posts').then(r => setPosts(r.data.posts || [])).catch(() => {});
  }, []);

  const handleDelete = async (id) => {
    await api.delete('/social/posts/' + id);
    setPosts(posts.filter(p => p.id !== id));
    setMessage('Post eliminado');
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div style={{minHeight:'100vh',background:'#f9fafb'}}>
      <nav style={{background:'#fff',padding:'12px 24px',display:'flex',justifyContent:'space-between',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{display:'flex',gap:16}}>
          <a href="/" style={{color:'#4f46e5',textDecoration:'none',fontWeight:700}}>← Dashboard</a>
          <a href="/import" style={{color:'#059669',textDecoration:'none'}}>+ Importar</a>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{fontSize:14,color:'#6b7280'}}>{user.name}</span>
          <button onClick={logout} style={{background:'none',border:'none',color:'#ef4444',cursor:'pointer'}}>Salir</button>
        </div>
      </nav>
      <main style={{maxWidth:800,margin:'0 auto',padding:32}}>
        <h2 style={{fontSize:24,fontWeight:700,marginBottom:24}}>Gestion de Posts</h2>
        {message && <div style={{padding:12,borderRadius:8,marginBottom:16,background:'#eef2ff',color:'#4f46e5'}}>{message}</div>}
        {posts.length === 0 ? (
          <p style={{color:'#6b7280',textAlign:'center',padding:40}}>No hay posts. <a href="/import" style={{color:'#4f46e5'}}>Importa tu primer post</a></p>
        ) : (
          <div style={{display:'grid',gap:12}}>
            {posts.map(post => (
              <div key={post.id} style={{background:'#fff',padding:16,borderRadius:12,boxShadow:'0 1px 3px rgba(0,0,0,0.1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <span style={{background:'#eef2ff',color:'#4f46e5',padding:'2px 8px',borderRadius:4,fontSize:12,marginRight:8}}>{post.platform}</span>
                  <span style={{fontSize:14}}>{post.caption?.substring(0, 60)}</span>
                  <p style={{fontSize:12,color:'#9ca3af',marginTop:4}}>❤️ {post.likes} | 💬 {post.comments}</p>
                </div>
                <button onClick={() => handleDelete(post.id)} style={{background:'#fef2f2',color:'#dc2626',border:'none',padding:'4px 12px',borderRadius:4,cursor:'pointer',fontSize:12}}>Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
