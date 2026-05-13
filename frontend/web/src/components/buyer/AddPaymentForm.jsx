import { useState } from 'react';

export default function AddPaymentForm({ onAdd, onCancel }) {
  const [form, setForm] = useState({
    type: 'card',
    details: { last4: '', brand: 'Visa' },
    isDefault: false
  });

  function handleSubmit(e) {
    e.preventDefault();
    onAdd(form);
  }

  return (
    <div style={{ marginTop: 20, padding: 28, background: '#f8fafc', borderRadius: 16 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Nuevo método de pago</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gap: 16 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Tipo</label>
            <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
              style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14 }}>
              <option value="card">💳 Tarjeta de crédito</option>
              <option value="paypal">🅿️ PayPal</option>
              <option value="stripe">🔵 Stripe</option>
              <option value="googlepay">📱 Google Pay</option>
              <option value="applepay">🍎 Apple Pay</option>
            </select>
          </div>
          {form.type === 'card' && (
            <>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Últimos 4 dígitos</label>
                <input value={form.details.last4} onChange={e => setForm({...form, details: {...form.details, last4: e.target.value}})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14 }}
                  placeholder="4242" maxLength={4} />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Marca</label>
                <select value={form.details.brand} onChange={e => setForm({...form, details: {...form.details, brand: e.target.value}})}
                  style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14 }}>
                  <option value="Visa">Visa</option>
                  <option value="Mastercard">Mastercard</option>
                  <option value="Amex">American Express</option>
                </select>
              </div>
            </>
          )}
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14 }}>
            <input type="checkbox" checked={form.isDefault} onChange={e => setForm({...form, isDefault: e.target.checked})} />
            Establecer como predeterminado
          </label>
          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" style={{ padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Guardar</button>
            <button type="button" onClick={onCancel} style={{ padding: '12px 24px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
          </div>
        </div>
      </form>
    </div>
  );
}
