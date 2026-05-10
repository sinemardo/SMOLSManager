import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    api.get('/products/' + id)
      .then(r => setProduct(r.data.product))
      .catch(() => navigate('/catalog'));
  }, [id]);

  if (!product) return <Layout user={user}><div style={{textAlign:'center',padding:80}}>Cargando...</div></Layout>;

  const images = product.images?.length > 0 ? product.images : [{ url: 'https://picsum.photos/400/400', alt: product.name }];
  const totalImages = Math.min(images.length, 6);

  return (
    <Layout user={user}>
      <div style={{maxWidth:900,margin:'0 auto'}}>
        <button onClick={() => navigate(-1)} style={{background:'none',border:'none',color:'#4f46e5',cursor:'pointer',fontSize:14,marginBottom:16}}>← Volver</button>
        
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{background:'#fff',borderRadius:16,padding:24,boxShadow:'0 1px 3px rgba(0,0,0,0.08)'}}>
          
          {/* Carrusel de imágenes */}
          <div style={{position:'relative',marginBottom:24,borderRadius:12,overflow:'hidden',background:'#f3f4f6',cursor:showFullscreen?'default':'pointer'}}
            onClick={() => !showFullscreen && setShowFullscreen(true)}>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={images[currentImage]?.url}
                alt={images[currentImage]?.alt || product.name}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ width: '100%', height: showFullscreen ? '75vh' : 400, objectFit: 'cover' }}
              />
            </AnimatePresence>
            
            {/* Controles del carrusel */}
            {totalImages > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => (prev - 1 + totalImages) % totalImages); }}
                  style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.5)',color:'#fff',border:'none',width:40,height:40,borderRadius:'50%',cursor:'pointer',fontSize:20}}>‹</button>
                <button onClick={(e) => { e.stopPropagation(); setCurrentImage(prev => (prev + 1) % totalImages); }}
                  style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'rgba(0,0,0,0.5)',color:'#fff',border:'none',width:40,height:40,borderRadius:'50%',cursor:'pointer',fontSize:20}}>›</button>
                
                {/* Dots */}
                <div style={{position:'absolute',bottom:12,left:'50%',transform:'translateX(-50%)',display:'flex',gap:6}}>
                  {images.slice(0, 6).map((_, i) => (
                    <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentImage(i); }}
                      style={{width:10,height:10,borderRadius:'50%',border:'none',background: i === currentImage ? '#4f46e5' : 'rgba(255,255,255,0.6)',cursor:'pointer'}} />
                  ))}
                </div>
              </>
            )}

            {/* Badge de cantidad */}
            <span style={{position:'absolute',top:12,right:12,background:'rgba(0,0,0,0.6)',color:'#fff',padding:'4px 10px',borderRadius:20,fontSize:12}}>
              {currentImage + 1} / {totalImages}
            </span>

            {/* Botón cerrar fullscreen */}
            {showFullscreen && (
              <button onClick={(e) => { e.stopPropagation(); setShowFullscreen(false); }}
                style={{position:'absolute',top:12,left:12,background:'rgba(0,0,0,0.6)',color:'#fff',border:'none',width:36,height:36,borderRadius:'50%',cursor:'pointer',fontSize:18}}>✕</button>
            )}
          </div>

          {/* Miniaturas */}
          {totalImages > 1 && (
            <div style={{display:'flex',gap:8,marginBottom:24,overflowX:'auto'}}>
              {images.slice(0, 6).map((img, i) => (
                <div key={i} onClick={() => setCurrentImage(i)}
                  style={{minWidth:64,height:64,borderRadius:8,overflow:'hidden',cursor:'pointer',border: i === currentImage ? '2px solid #4f46e5' : '2px solid transparent',opacity: i === currentImage ? 1 : 0.6}}>
                  <img src={img.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                </div>
              ))}
            </div>
          )}

          {/* Info del producto */}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24}}>
            <div>
              <span style={{background:'#eef2ff',color:'#4f46e5',padding:'4px 12px',borderRadius:20,fontSize:12}}>{product.category?.displayName}</span>
              <h1 style={{fontSize:24,fontWeight:700,marginTop:8}}>{product.name}</h1>
              <p style={{fontSize:28,fontWeight:700,color:'#4f46e5',marginTop:8}}>€{product.price}</p>
              <p style={{color:'#6b7280',marginTop:12,lineHeight:1.6}}>{product.description || 'Sin descripción'}</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div style={{background:'#f9fafb',padding:12,borderRadius:8}}><p style={{fontSize:12,color:'#6b7280'}}>Stock</p><p style={{fontWeight:600}}>{product.stock || 0}</p></div>
              <div style={{background:'#f9fafb',padding:12,borderRadius:8}}><p style={{fontSize:12,color:'#6b7280'}}>Vistas</p><p style={{fontWeight:600}}>{product.views || 0} 👁️</p></div>
              <div style={{background:'#f9fafb',padding:12,borderRadius:8}}><p style={{fontSize:12,color:'#6b7280'}}>Estado</p><p style={{fontWeight:600,color:product.isActive?'#059669':'#dc2626'}}>{product.isActive?'✅ Activo':'❌ Inactivo'}</p></div>
              <div style={{background:'#f9fafb',padding:12,borderRadius:8}}><p style={{fontSize:12,color:'#6b7280'}}>Origen</p><p style={{fontWeight:600,fontSize:12}}>{product.socialPlatform||'Manual'}</p></div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
