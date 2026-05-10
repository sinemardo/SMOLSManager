import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    api.get('/products/' + id)
      .then(r => setProduct(r.data.product))
      .catch(() => navigate('/catalog'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout user={user}><div style={{textAlign:'center',padding:60}}>Cargando...</div></Layout>;
  if (!product) return null;

  return (
    <Layout user={user}>
      <div className="animate-fade-in" style={{maxWidth:800,margin:'0 auto'}}>
        <button onClick={() => navigate(-1)} style={{background:'none',border:'none',color:'#4f46e5',cursor:'pointer',fontSize:14,marginBottom:16}}>← Volver</button>
        
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{background:'#fff',borderRadius:16,padding:32,boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:32,alignItems:'start'}}>
            <div style={{height:300,background:'linear-gradient(135deg,#eef2ff,#f5f3ff)',borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:72}}>📦</span>
            </div>
            <div>
              <span style={{background:'#eef2ff',color:'#4f46e5',padding:'4px 12px',borderRadius:20,fontSize:12}}>{product.category?.displayName}</span>
              <h1 style={{fontSize:28,fontWeight:700,marginTop:12}}>{product.name}</h1>
              <p style={{fontSize:32,fontWeight:700,color:'#4f46e5',marginTop:8}}>€{product.price}</p>
              <p style={{color:'#6b7280',marginTop:12,lineHeight:1.6}}>{product.description || 'Sin descripción'}</p>
              
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginTop:24}}>
                <div style={{background:'#f9fafb',padding:12,borderRadius:8}}>
                  <p style={{fontSize:12,color:'#6b7280'}}>Stock</p>
                  <p style={{fontWeight:600}}>{product.stock || 0} unidades</p>
                </div>
                <div style={{background:'#f9fafb',padding:12,borderRadius:8}}>
                  <p style={{fontSize:12,color:'#6b7280'}}>Vistas</p>
                  <p style={{fontWeight:600}}>{product.views || 0} 👁️</p>
                </div>
                <div style={{background:'#f9fafb',padding:12,borderRadius:8}}>
                  <p style={{fontSize:12,color:'#6b7280'}}>Estado</p>
                  <p style={{fontWeight:600,color:product.isActive?'#059669':'#dc2626'}}>{product.isActive ? '✅ Activo' : '❌ Inactivo'}</p>
                </div>
                <div style={{background:'#f9fafb',padding:12,borderRadius:8}}>
                  <p style={{fontSize:12,color:'#6b7280'}}>Origen</p>
                  <p style={{fontWeight:600}}>{product.socialPlatform || 'Manual'} {product.postUrl && <a href={product.postUrl} target="_blank" style={{color:'#4f46e5',fontSize:12}}>Ver post</a>}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
