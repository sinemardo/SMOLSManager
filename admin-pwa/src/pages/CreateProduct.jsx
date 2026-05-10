import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

export default function CreateProduct() {
  const [form, setForm] = useState({ name: '', description: '', price: '', categoryId: '', stock: 1 });
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useState(() => {
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  const addImage = () => {
    if (images.length >= 6) {
      setMessage('Máximo 6 imágenes');
      return;
    }
    const url = prompt('URL de la imagen:');
    if (url) setImages([...images, { url, alt: form.name || 'Producto' }]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.categoryId) {
      setMessage('Nombre, precio y categoría son obligatorios');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await api.post('/products', {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        images: images.length > 0 ? images : [{ url: 'https://picsum.photos/400/400', alt: form.name }]
      });
      setMessage('¡Producto creado exitosamente!');
      setForm({ name: '', description: '', price: '', categoryId: '', stock: 1 });
      setImages([]);
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Completa todos los campos'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout user={user}>
      <div style={{maxWidth:700,margin:'0 auto'}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="card">
          <h2 style={{fontSize:20,fontWeight:700,marginBottom:4}}>📦 Crear Producto</h2>
          <p style={{color:'#6b7280',fontSize:14,marginBottom:24}}>Crea un producto manualmente sin necesidad de importar desde redes sociales</p>

          {message && (
            <div style={{padding:'12px 16px',borderRadius:8,marginBottom:16,fontSize:14,
              background: message.includes('Error')?'#fef2f2':'#ecfdf5',color: message.includes('Error')?'#dc2626':'#059669'}}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{display:'grid',gap:16,marginBottom:20}}>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:6}}>Nombre del Producto *</label>
                <input type="text" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}
                  style={{width:'100%',padding:'12px 16px',border:'2px solid #e5e7eb',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box'}} required />
              </div>
              <div>
                <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:6}}>Descripción</label>
                <textarea value={form.description} onChange={e=>setForm({...form,description:e.target.value})} rows={3}
                  style={{width:'100%',padding:'12px 16px',border:'2px solid #e5e7eb',borderRadius:8,fontSize:14,outline:'none',resize:'vertical',fontFamily:'inherit',boxSizing:'border-box'}} />
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:6}}>Precio (€) *</label>
                  <input type="number" step="0.01" value={form.price} onChange={e=>setForm({...form,price:e.target.value})}
                    style={{width:'100%',padding:'12px 16px',border:'2px solid #e5e7eb',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box'}} required />
                </div>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:6}}>Stock</label>
                  <input type="number" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})}
                    style={{width:'100%',padding:'12px 16px',border:'2px solid #e5e7eb',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box'}} />
                </div>
                <div>
                  <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:6}}>Categoría *</label>
                  <select value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})}
                    style={{width:'100%',padding:'12px 16px',border:'2px solid #e5e7eb',borderRadius:8,fontSize:14,outline:'none',boxSizing:'border-box'}} required>
                    <option value="">Selecciona</option>
                    {categories.map(c=><option key={c.id} value={c.id}>{c.displayName}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Imágenes */}
            <div style={{marginBottom:20}}>
              <label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:8}}>Imágenes ({images.length}/6)</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill, minmax(100px, 1fr))',gap:8,marginBottom:12}}>
                {images.map((img, i) => (
                  <div key={i} style={{position:'relative',borderRadius:8,overflow:'hidden',height:100}}>
                    <img src={img.url} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}} />
                    <button type="button" onClick={()=>removeImage(i)}
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
              style={{width:'100%',padding:'14px',background: loading?'#9ca3af':'linear-gradient(135deg,#059669,#10b981)',color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:600,cursor: loading?'not-allowed':'pointer'}}>
              {loading?'⏳ Creando...':'📦 Crear Producto'}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </Layout>
  );
}
