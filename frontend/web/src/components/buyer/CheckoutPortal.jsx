import { useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

export default function CheckoutPortal({ cart, cartTotal, user, onBack, onSuccess }) {
  const [step, setStep] = useState(1); // 1: Resumen, 2: Confirmación
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Cargar dirección y pago desde localStorage
  const shipping = JSON.parse(localStorage.getItem('buyer_shipping') || '{}');
  const paymentMethods = JSON.parse(localStorage.getItem('buyer_payment_methods') || '[]');
  const defaultPayment = paymentMethods.find(p => p.isDefault) || paymentMethods[0];

  async function handleConfirmOrder() {
    if (cart.length === 0) {
      setMessage('❌ El carrito está vacío');
      return;
    }

    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('smols_token');
      const orderData = {
        products: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity || 1
        })),
        shippingAddress: shipping.address ? shipping : undefined,
        notes: ''
      };

      await axios.post(API + '/orders', orderData, {
        headers: { Authorization: 'Bearer ' + token }
      });

      setStep(2);
      onSuccess(); // vaciar carrito en el padre
    } catch (err) {
      setMessage('❌ Error: ' + (err.response?.data?.message || 'No se pudo crear el pedido'));
    } finally {
      setLoading(false);
    }
  }

  if (step === 2) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 32, textAlign: 'center' }}>
        <span style={{ fontSize: 64 }}>🎉</span>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#059669', marginTop: 16 }}>¡Pedido realizado con éxito!</h2>
        <p style={{ color: '#64748b', marginTop: 8 }}>Recibirás una confirmación por email.</p>
        <button onClick={() => { onBack(); onSuccess(); }}
          style={{ marginTop: 24, padding: '12px 32px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 15 }}>
          Volver a la tienda
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 32 }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 16, cursor: 'pointer', color: '#6366f1', fontWeight: 600, marginBottom: 24 }}>
        ← Volver al carrito
      </button>

      <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 32 }}>📦 Finalizar Pedido</h2>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: message.includes('✅') ? '#ecfdf5' : '#fef2f2', color: message.includes('✅') ? '#059669' : '#dc2626', fontSize: 14 }}>
          {message}
        </div>
      )}

      {/* Resumen de artículos */}
      <div style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>🛒 Artículos ({cart.length})</h3>
        {cart.map(item => (
          <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9', fontSize: 15 }}>
            <span>{item.name} x{item.quantity || 1}</span>
            <span style={{ fontWeight: 600 }}>€{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, padding: '12px 0', borderTop: '2px solid #e2e8f0' }}>
          <span style={{ fontSize: 18, fontWeight: 700 }}>Total</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: '#6366f1' }}>€{cartTotal.toFixed(2)}</span>
        </div>
      </div>

      {/* Dirección de envío */}
      <div style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: 20 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>🚚 Dirección de envío</h3>
        {shipping.address ? (
          <div style={{ fontSize: 14, color: '#374151' }}>
            <p style={{ fontWeight: 600 }}>{shipping.address}</p>
            <p>{shipping.city}, {shipping.state} {shipping.zip}</p>
            <p>{shipping.country}</p>
          </div>
        ) : (
          <p style={{ color: '#64748b', fontSize: 14 }}>
            No has guardado una dirección. Puedes añadirla en tu perfil.
          </p>
        )}
      </div>

      {/* Método de pago */}
      <div style={{ background: '#fff', padding: 24, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)', marginBottom: 24 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>💳 Método de pago</h3>
        {defaultPayment ? (
          <div style={{ fontSize: 14 }}>
            <span style={{ fontWeight: 600 }}>
              {defaultPayment.type === 'card' ? '💳 ' + (defaultPayment.details?.brand || 'Tarjeta') + ' ···· ' + (defaultPayment.details?.last4 || '****') : defaultPayment.type}
            </span>
            {defaultPayment.isDefault && <span style={{ marginLeft: 8, color: '#6366f1', fontSize: 12 }}>(Predeterminado)</span>}
          </div>
        ) : (
          <p style={{ color: '#64748b', fontSize: 14 }}>
            No has guardado un método de pago. Puedes añadirlo en tu perfil.
          </p>
        )}
      </div>

      {/* Botón de confirmación */}
      <button onClick={handleConfirmOrder} disabled={loading}
        style={{
          width: '100%', padding: '16px', background: loading ? '#9ca3af' : '#059669',
          color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 16,
          cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s'
        }}>
        {loading ? '⏳ Procesando pedido...' : '✅ Confirmar pedido'}
      </button>
    </div>
  );
}
