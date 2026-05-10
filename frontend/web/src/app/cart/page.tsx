'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, total, itemsCount } = useCart();
  const { buyer } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    if (!buyer) {
      router.push('/login');
      return;
    }

    try {
      await api.post('/orders', {
        products: cart.map(item => ({ productId: item.productId, quantity: item.quantity }))
      });
      clearCart();
      setMessage('✅ Pedido realizado con éxito');
      setTimeout(() => router.push('/orders'), 1500);
    } catch (err: any) {
      setMessage('❌ Error: ' + (err.response?.data?.message || 'No se pudo procesar'));
    }
  };

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center', padding: 16 }}>
        <span style={{ fontSize: 64 }}>🛒</span>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 16 }}>Carrito vacío</h2>
        <p style={{ color: '#6b7280', marginTop: 8 }}>Agrega productos desde el catálogo</p>
        <Link href="/" style={{ display: 'inline-block', marginTop: 20, padding: '12px 24px', background: '#4f46e5', color: '#fff', textDecoration: 'none', borderRadius: 8, fontWeight: 600 }}>
          Ver productos
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: '40px auto', padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 24 }}>🛒 Carrito ({itemsCount} productos)</h1>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: 8, marginBottom: 16, background: message.includes('✅') ? '#ecfdf5' : '#fef2f2', color: message.includes('✅') ? '#059669' : '#dc2626' }}>
          {message}
        </div>
      )}

      <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
        {cart.map(item => (
          <div key={item.productId} style={{ background: '#fff', padding: 16, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div>
              <p style={{ fontWeight: 600 }}>{item.name}</p>
              <p style={{ color: '#4f46e5', fontWeight: 700 }}>€{item.price}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} style={{ width: 30, height: 30, border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 16 }}>−</button>
              <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} style={{ width: 30, height: 30, border: '1px solid #d1d5db', borderRadius: 6, background: '#fff', cursor: 'pointer', fontSize: 16 }}>+</button>
              <button onClick={() => removeFromCart(item.productId)} style={{ marginLeft: 12, background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 20 }}>🗑️</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.06)', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 16 }}>Subtotal</span>
          <span style={{ fontSize: 16, fontWeight: 600 }}>€{total.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 700 }}>Total</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: '#4f46e5' }}>€{total.toFixed(2)}</span>
        </div>
      </div>

      <button onClick={handleCheckout}
        style={{ width: '100%', padding: '16px', background: '#059669', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: 'pointer' }}>
        {buyer ? '✅ Realizar Pedido' : '🔑 Inicia sesión para comprar'}
      </button>
    </div>
  );
}
