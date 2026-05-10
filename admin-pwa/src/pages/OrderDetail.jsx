import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../components/layout/Layout';
import api from '../services/api';

const statusColors = {
  pending: { bg: '#fffbeb', color: '#d97706', label: 'Pendiente' },
  confirmed: { bg: '#eff6ff', color: '#2563eb', label: 'Confirmado' },
  shipped: { bg: '#fff7ed', color: '#ea580c', label: 'Enviado' },
  delivered: { bg: '#ecfdf5', color: '#059669', label: 'Entregado' },
  cancelled: { bg: '#fef2f2', color: '#dc2626', label: 'Cancelado' }
};

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const user = JSON.parse(localStorage.getItem('smols_user') || '{}');

  useEffect(() => {
    api.get('/orders/' + id)
      .then(r => setOrder(r.data.order))
      .catch(() => navigate('/orders'))
  }, [id]);

  const handleStatus = async (status) => {
    await api.patch('/orders/' + id + '/status', { status });
    setOrder({...order, status});
  };

  if (!order) return <Layout user={user}><div style={{textAlign:'center',padding:60}}>Cargando...</div></Layout>;

  return (
    <Layout user={user}>
      <div className="animate-fade-in" style={{maxWidth:700,margin:'0 auto'}}>
        <button onClick={() => navigate(-1)} style={{background:'none',border:'none',color:'#4f46e5',cursor:'pointer',fontSize:14,marginBottom:16}}>← Volver</button>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} style={{background:'#fff',borderRadius:16,padding:32,boxShadow:'0 1px 3px rgba(0,0,0,0.08)',marginBottom:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
            <div>
              <p style={{fontSize:12,color:'#6b7280'}}>Orden #{order.id?.substring(0,8)}</p>
              <h1 style={{fontSize:24,fontWeight:700}}>€{order.totalAmount?.toFixed(2)}</h1>
            </div>
            <span style={{...statusColors[order.status],padding:'8px 16px',borderRadius:20,fontSize:14,fontWeight:500}}>
              {statusColors[order.status]?.label}
            </span>
          </div>

          <div style={{marginBottom:24}}>
            <h3 style={{fontSize:14,fontWeight:600,marginBottom:8}}>Productos</h3>
            {order.items?.map((item,i) => (
              <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'12px 0',borderBottom:'1px solid #f3f4f6'}}>
                <span>{item.product?.name} x{item.quantity}</span>
                <span style={{fontWeight:500}}>€{(item.price*item.quantity)?.toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:24}}>
            <div style={{background:'#f9fafb',padding:12,borderRadius:8}}>
              <p style={{fontSize:12,color:'#6b7280'}}>Comprador</p>
              <p style={{fontWeight:600}}>{order.buyer?.name || 'N/A'}</p>
              <p style={{fontSize:12,color:'#9ca3af'}}>{order.buyer?.email}</p>
            </div>
            <div style={{background:'#f9fafb',padding:12,borderRadius:8}}>
              <p style={{fontSize:12,color:'#6b7280'}}>Fecha</p>
              <p style={{fontWeight:600}}>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {order.shippingAddress?.street && (
            <div style={{marginBottom:24}}>
              <h3 style={{fontSize:14,fontWeight:600,marginBottom:8}}>Dirección de envío</h3>
              <p style={{color:'#6b7280'}}>{order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            </div>
          )}

          <div style={{display:'flex',gap:8}}>
            {order.status === 'pending' && <button onClick={()=>handleStatus('confirmed')} style={{padding:'10px 20px',background:'#4f46e5',color:'#fff',border:'none',borderRadius:8,cursor:'pointer'}}>✅ Confirmar</button>}
            {order.status === 'confirmed' && <button onClick={()=>handleStatus('shipped')} style={{padding:'10px 20px',background:'#ea580c',color:'#fff',border:'none',borderRadius:8,cursor:'pointer'}}>📦 Marcar Enviado</button>}
            {order.status === 'shipped' && <button onClick={()=>handleStatus('delivered')} style={{padding:'10px 20px',background:'#059669',color:'#fff',border:'none',borderRadius:8,cursor:'pointer'}}>🏠 Marcar Entregado</button>}
            {(order.status !== 'cancelled' && order.status !== 'delivered') && <button onClick={()=>handleStatus('cancelled')} style={{padding:'10px 20px',background:'#fef2f2',color:'#dc2626',border:'none',borderRadius:8,cursor:'pointer'}}>❌ Cancelar</button>}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
