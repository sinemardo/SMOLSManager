import { useState, useEffect } from 'react';
import axios from 'axios';
import PaymentMethodCard from './PaymentMethodCard';
import AddPaymentForm from './AddPaymentForm';

const API = 'http://localhost:3000/api/v1';

export default function PaymentTab() {
  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMethods(); }, []);

  async function loadMethods() {
    try {
      const token = localStorage.getItem('smols_token');
      const res = await axios.get(API + '/payments/methods', { headers: { Authorization: 'Bearer ' + token } });
      setMethods(res.data.methods || []);
    } catch (err) {
      setMessage('Error al cargar métodos');
    } finally { setLoading(false); }
  }

  async function handleAdd(form) {
    if (methods.length >= 3) { setMessage('Máximo 3 métodos'); return; }
    try {
      const token = localStorage.getItem('smols_token');
      await axios.post(API + '/payments/methods', form, { headers: { Authorization: 'Bearer ' + token } });
      setMessage('✅ Método añadido');
      setShowForm(false);
      loadMethods();
    } catch (err) {
      setMessage('❌ Error: ' + (err.response?.data?.message || 'No se pudo añadir'));
    }
  }

  async function handleSetDefault(id) {
    try {
      const token = localStorage.getItem('smols_token');
      await axios.put(API + '/payments/methods/' + id + '/default', {}, { headers: { Authorization: 'Bearer ' + token } });
      loadMethods();
    } catch (err) { setMessage('Error al cambiar predeterminado'); }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar este método?')) return;
    try {
      const token = localStorage.getItem('smols_token');
      await axios.delete(API + '/payments/methods/' + id, { headers: { Authorization: 'Bearer ' + token } });
      loadMethods();
      setMessage('Método eliminado');
    } catch (err) { setMessage('Error al eliminar'); }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando métodos...</div>;

  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>💳 Métodos de Pago ({methods.length}/3)</h2>
        {methods.length < 3 && !showForm && (
          <button onClick={() => setShowForm(true)} style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
            + Añadir método
          </button>
        )}
      </div>

      {message && (
        <div style={{ padding: '12px 16px', borderRadius: 10, marginBottom: 20, background: message.includes('✅') ? '#ecfdf5' : '#fef2f2', color: message.includes('✅') ? '#059669' : '#dc2626', fontSize: 14 }}>
          {message}
        </div>
      )}

      {methods.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: 60, background: '#f8fafc', borderRadius: 16 }}>
          <span style={{ fontSize: 48 }}>💳</span>
          <p style={{ color: '#64748b', marginTop: 12, fontSize: 15 }}>No tienes métodos de pago guardados</p>
          <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 4 }}>Añade uno para empezar</p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 16 }}>
        {methods.map(m => (
          <PaymentMethodCard key={m.id} method={m} onSetDefault={handleSetDefault} onDelete={handleDelete} />
        ))}
      </div>

      {showForm && (
        <AddPaymentForm onAdd={handleAdd} onCancel={() => setShowForm(false)} />
      )}

      <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 32 }}>
        🔒 Puedes guardar hasta 3 métodos de pago. Tus datos están protegidos.
      </p>
    </div>
  );
}
