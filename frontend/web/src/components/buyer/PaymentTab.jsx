import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

const paymentMethods = [
  { id: 'card', label: 'Tarjeta', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'stripe', label: 'Stripe', icon: '🔵' },
  { id: 'googlepay', label: 'Google Pay', icon: '📱' },
  { id: 'applepay', label: 'Apple Pay', icon: '🍎' }
];

export default function PaymentTab() {
  const [selected, setSelected] = useState('card');
  const [saved, setSaved] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadSaved(); }, []);

  async function loadSaved() {
    try {
      const token = localStorage.getItem('smols_token');
      const res = await axios.get(API + '/payments/methods', { headers: { Authorization: 'Bearer ' + token } });
      setSaved(res.data.methods || []);
      // Seleccionar el predeterminado o el primero
      const def = res.data.methods?.find(m => m.isDefault);
      if (def) setSelected(def.type);
      else if (res.data.methods?.length > 0) setSelected(res.data.methods[0].type);
    } catch (err) { /* silencioso */ } finally { setLoading(false); }
  }

  async function handleSave() {
    try {
      const token = localStorage.getItem('smols_token');
      if (saved.length >= 3 && !saved.find(m => m.type === selected)) {
        setMessage('Máximo 3 métodos de pago');
        return;
      }
      await axios.post(API + '/payments/methods', { type: selected, details: {}, isDefault: true }, 
        { headers: { Authorization: 'Bearer ' + token } });
      setMessage('✅ Método guardado correctamente');
      loadSaved();
    } catch (err) {
      setMessage('❌ Error al guardar');
    }
  }

  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>💳 Método de Pago</h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Selecciona tu método de pago preferido</p>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: message.includes('✅') ? '#ecfdf5' : '#fef2f2', color: message.includes('✅') ? '#059669' : '#dc2626', fontSize: 14 }}>
          {message}
        </div>
      )}

      {/* Selector horizontal con checkbox circular */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
        {paymentMethods.map(method => (
          <div
            key={method.id}
            onClick={() => setSelected(method.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px', borderRadius: 16, cursor: 'pointer',
              border: selected === method.id ? '2px solid #6366f1' : '1px solid #e2e8f0',
              background: selected === method.id ? '#eef2ff' : '#fff',
              transition: 'all 0.2s'
            }}>
            {/* Checkbox circular */}
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              border: selected === method.id ? '2px solid #6366f1' : '2px solid #d1d5db',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: selected === method.id ? '#6366f1' : '#fff',
              transition: 'all 0.2s'
            }}>
              {selected === method.id && (
                <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>✓</span>
              )}
            </div>
            {/* Icono y label */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 24 }}>{method.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{method.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Botón guardar */}
      <button onClick={handleSave}
        style={{ width: '100%', padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>
        💾 Guardar método de pago
      </button>

      {/* Métodos guardados */}
      {saved.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Métodos guardados ({saved.length}/3)</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {saved.map(m => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#f8fafc', borderRadius: 12, border: m.isDefault ? '1px solid #6366f1' : '1px solid #e2e8f0' }}>
                <span style={{ fontSize: 24 }}>{paymentMethods.find(p => p.id === m.type)?.icon || '💳'}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, fontSize: 14 }}>{paymentMethods.find(p => p.id === m.type)?.label || m.type}</p>
                </div>
                {m.isDefault && (
                  <span style={{ background: '#eef2ff', color: '#6366f1', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Predeterminado</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
