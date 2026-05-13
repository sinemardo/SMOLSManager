import { useState } from 'react';

export default function PaymentTab({ payment, setPayment }) {
  const [selectedGateway, setSelectedGateway] = useState('card');

  const gateways = [
    { id: 'card', label: 'Tarjeta de crédito', icon: '💳' },
    { id: 'paypal', label: 'PayPal', icon: '🅿️' },
    { id: 'stripe', label: 'Stripe', icon: '🔵' },
    { id: 'googlepay', label: 'Google Pay', icon: '📱' },
    { id: 'applepay', label: 'Apple Pay', icon: '🍎' }
  ];

  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>💳 Métodos de Pago</h2>
      <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14 }}>
        Selecciona tu pasarela de pago favorita. Todas son seguras y oficiales.
      </p>

      {/* Selector de pasarela */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 32, flexWrap: 'wrap' }}>
        {gateways.map(gw => (
          <button key={gw.id}
            onClick={() => setSelectedGateway(gw.id)}
            style={{
              padding: '12px 20px', border: '2px solid ' + (selectedGateway === gw.id ? '#6366f1' : '#e2e8f0'),
              borderRadius: 12, background: selectedGateway === gw.id ? '#eef2ff' : '#fff',
              cursor: 'pointer', fontWeight: 600, fontSize: 14, color: selectedGateway === gw.id ? '#6366f1' : '#475569'
            }}>
            {gw.icon} {gw.label}
          </button>
        ))}
      </div>

      {/* Formulario de tarjeta (se muestra solo si se selecciona 'card') */}
      {selectedGateway === 'card' && (
        <form onSubmit={(e) => { e.preventDefault(); alert('Método de pago guardado correctamente.'); }} style={{ maxWidth: 500 }}>
          <div style={{ display: 'grid', gap: 16 }}>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Titular</label><input value={payment.name} onChange={e => setPayment({...payment, name: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Número de tarjeta</label><input value={payment.cardNumber} onChange={e => setPayment({...payment, cardNumber: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} maxLength={19} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Expiración</label><input value={payment.expiry} onChange={e => setPayment({...payment, expiry: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} maxLength={5} /></div>
              <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>CVV</label><input value={payment.cvv} onChange={e => setPayment({...payment, cvv: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} maxLength={4} type="password" /></div>
            </div>
            <button type="submit" style={{ padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>💾 Guardar método de pago</button>
          </div>
        </form>
      )}

      {/* Mensaje para otras pasarelas */}
      {selectedGateway !== 'card' && (
        <div style={{ background: '#f8fafc', padding: 24, borderRadius: 12, textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 600, color: '#374151' }}>
            {gateways.find(g => g.id === selectedGateway)?.label}
          </p>
          <p style={{ color: '#64748b', marginTop: 8 }}>
            Serás redirigido a la pasarela oficial para completar el pago.
          </p>
          <button style={{ marginTop: 16, padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            Conectar cuenta
          </button>
        </div>
      )}
      
      <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 16 }}>
        🔒 Tus datos están protegidos. No almacenamos información real de tarjeta.
      </p>
    </div>
  );
}
