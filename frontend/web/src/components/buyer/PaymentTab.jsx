import { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentSelector from './PaymentSelector';
import CardForm from './CardForm';
import PaymentMethodCard from './PaymentMethodCard';

const API = 'http://localhost:3000/api/v1';

export default function PaymentTab() {
  const [selected, setSelected] = useState('card');
  const [saved, setSaved] = useState([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { loadSaved(); }, []);

  async function loadSaved() {
    try {
      const token = localStorage.getItem('smols_token');
      const res = await axios.get(API + '/payments/methods', { headers: { Authorization: 'Bearer ' + token } });
      setSaved(res.data.methods || []);
    } catch (err) {}
  }

  async function handleSaveCard(details) {
    try {
      const token = localStorage.getItem('smols_token');
      await axios.post(API + '/payments/methods', { type: 'card', details, isDefault: true }, { headers: { Authorization: 'Bearer ' + token } });
      setMessage('✅ Tarjeta guardada');
      setShowCardForm(false);
      loadSaved();
    } catch (err) { setMessage('❌ Error al guardar'); }
  }

  async function handleSaveNonCard() {
    try {
      const token = localStorage.getItem('smols_token');
      await axios.post(API + '/payments/methods', { type: selected, details: {}, isDefault: true }, { headers: { Authorization: 'Bearer ' + token } });
      setMessage('✅ Método guardado');
      loadSaved();
    } catch (err) { setMessage('❌ Error al guardar'); }
  }

  async function handleSetDefault(id) {
    try {
      const token = localStorage.getItem('smols_token');
      await axios.put(API + '/payments/methods/' + id + '/default', {}, { headers: { Authorization: 'Bearer ' + token } });
      loadSaved();
    } catch (err) { setMessage('Error al cambiar predeterminado'); }
  }

  async function handleDelete(id) {
    if (!confirm('Eliminar este método?')) return;
    try {
      const token = localStorage.getItem('smols_token');
      await axios.delete(API + '/payments/methods/' + id, { headers: { Authorization: 'Bearer ' + token } });
      loadSaved();
      setMessage('Método eliminado');
    } catch (err) { setMessage('Error al eliminar'); }
  }

  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>💳 Método de Pago</h2>
      <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>Selecciona tu método de pago preferido</p>
      {message && <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: message.includes('✅') ? '#ecfdf5' : '#fef2f2', color: message.includes('✅') ? '#059669' : '#dc2626', fontSize: 14 }}>{message}</div>}
      <PaymentSelector selected={selected} onSelect={(id) => { setSelected(id); setShowCardForm(id === 'card'); }} />
      {selected === 'card' && showCardForm && <CardForm onSubmit={handleSaveCard} onCancel={() => setShowCardForm(false)} />}
      {selected !== 'card' && <button onClick={handleSaveNonCard} style={{ width: '100%', padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 24 }}>💾 Guardar {selected}</button>}
      {saved.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Métodos guardados ({saved.length}/3)</h3>
          <div style={{ display: 'grid', gap: 8 }}>
            {saved.map(m => <PaymentMethodCard key={m.id} method={m} onSetDefault={handleSetDefault} onDelete={handleDelete} />)}
          </div>
        </div>
      )}
    </div>
  );
}
