import { useState } from 'react';

export default function CardForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ last4: '', brand: 'Visa' });

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div style={{ padding: 24, background: '#f8fafc', borderRadius: 16, marginBottom: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Datos de la tarjeta</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Últimos 4 dígitos</label>
            <input value={form.last4} onChange={e => setForm({...form, last4: e.target.value})} placeholder="4242" maxLength={4} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 6 }}>Marca</label>
            <select value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 10, fontSize: 14, boxSizing: 'border-box' }}>
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="Amex">American Express</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button type="submit" style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Guardar</button>
          <button type="button" onClick={onCancel} style={{ padding: '10px 20px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
        </div>
      </form>
    </div>
  );
}
