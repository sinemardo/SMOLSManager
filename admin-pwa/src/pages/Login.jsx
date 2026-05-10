import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('smols_token', res.data.accessToken);
      localStorage.setItem('smols_user', JSON.stringify(res.data.user));
      window.location.href = '/';
    } catch (err) {
      setError('Error al iniciar sesion');
    }
  };

  return (
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'linear-gradient(135deg,#4f46e5,#7c3aed)'}}>
      <div style={{background:'#fff',padding:32,borderRadius:16,width:'100%',maxWidth:400}}>
        <h1 style={{fontSize:28,fontWeight:700,color:'#4f46e5',textAlign:'center'}}>SMOLSManager</h1>
        {error && <div style={{background:'#fef2f2',color:'#dc2626',padding:12,borderRadius:8,marginTop:16}}>{error}</div>}
        <form onSubmit={handleSubmit} style={{marginTop:24}}>
          <input type='email' value={email} onChange={e => setEmail(e.target.value)} style={{width:'100%',padding:12,border:'1px solid #d1d5db',borderRadius:8,marginBottom:12}} placeholder='Email' required />
          <input type='password' value={password} onChange={e => setPassword(e.target.value)} style={{width:'100%',padding:12,border:'1px solid #d1d5db',borderRadius:8,marginBottom:16}} placeholder='Contrasena' required />
          <button type='submit' style={{width:'100%',padding:12,background:'#4f46e5',color:'#fff',border:'none',borderRadius:8,fontSize:16,cursor:'pointer'}}>Iniciar Sesion</button>
        </form>
      </div>
    </div>
  );
}
