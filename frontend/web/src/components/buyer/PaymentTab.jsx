import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

export default function PaymentTab() {
  const [methods, setMethods] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newMethod, setNewMethod] = useState({
    type: 'card',
    details: { last4: '', brand: 'Visa' },
    isDefault: false
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadMethods(); }, []);

  async function loadMethods() {
    try {
      const token = localStorage.getItem('smols_token');
      const res = await axios.get(API + '/payments/methods', {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMethods(res.data.methods || []);
    } catch (err) {
      setMessage('Error al cargar métodos de pago');
    } finally { setLoading(false); }
  }

  async function handleAddMethod(e) {
    e.preventDefault();
    if (methods.length >= 3) {
      setMessage('Máximo 3 métodos de pago permitidos');
      return;
    }
    try {
      const token = localStorage.getItem('smols_token');
      await axios.post(API + '/payments/methods', newMethod, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setMessage('✅ Método añadido');
      setShowForm(false);
      setNewMethod({ type: 'card', details: { last4: '', brand: 'Visa' }, isDefault: false });
      loadMethods();
    } catch (err) {
      setMessage('❌ Error: ' + (err.response?.data?.message || 'No se pudo añadir'));
    }
  }

  async function handleSetDefault(methodId) {
    try {
      const token = localStorage.getItem('smols_token');
      await axios.put(API + '/payments/methods/' + methodId + '/default', {}, {
        headers: { Authorization: 'Bearer ' + token }
      });
      loadMethods();
    } catch (err) {
      setMessage('Error al cambiar predeterminado');
    }
  }

  async function handleDelete(methodId) {
    if (!confirm('¿Eliminar este método?')) return;
    try {
      const token = localStorage.getItem('smols_token');
      await axios.delete(API + '/payments/methods/' + methodId, {
        headers: { Authorization: 'Bearer ' + token }
      });
      loadMethods();
      setMessage('Método eliminado');
    } catch (err) {
      setMessage('Error al eliminar');
    }
  }

  if (loading) return <div style={{ padding: 40, textAlign: 'center' }}>Cargando métodos de pago...</div>;

  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>💳 Métodos de Pago ({methods.length}/3)</h2>
      {message && <div style={{ padding: 12, borderRadius: 8, marginBottom: 16, background: message.includes('✅') ? '#ecfdf5' : '#fef2f2', color: message.includes('✅') ? '#059669' : '#dc2626' }}>{message}</div>}

      {/* Estado vacío: solo se muestra si no hay métodos y no se está mostrando el formulario */}
      {methods.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: 40, background: '#f8fafc', borderRadius: 12 }}>
          <p style={{ color: '#64748b' }}>No tienes métodos de pago guardados.</p>
          <button onClick={() => setShowForm(true)} style={{ marginTop: 12, padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
            + Añadir método
          </button>
        </div>
      )}

      {/* Lista de métodos guardados */}
      {methods.length > 0 && (
        <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
          {methods.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, background: '#f8fafc', borderRadius: 10, border: m.isDefault ? '2px solid #6366f1' : '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontWeight: 600 }}>{m.type === 'card' ? '💳 ' + (m.details.brand || 'Tarjeta') + ' ···· ' + (m.details.last4 || '****') : m.type}</span>
                {m.isDefault && <span style={{ marginLeft: 8, background: '#eef2ff', color: '#6366f1', padding: '2px 8px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>Predeterminado</span>}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {!m.isDefault && (
                  <button onClick={() => handleSetDefault(m.id)} style={{ background: 'none', border: '1px solid #6366f1', color: '#6366f1', padding: '6px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 13 }}>
                    Establecer por defecto
                  </button>
                )}
                <button onClick={() => handleDelete(m.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botón para añadir nuevo: solo se muestra si hay entre 1 y 2 métodos, y no se está mostrando el formulario */}
      {methods.length > 0 && methods.length < 3 && !showForm && (
        <button onClick={() => setShowForm(true)} style={{ padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>
          + Añadir otro método
        </button>
      )}

      {/* Formulario para añadir nuevo método */}
      {showForm && (
        <div style={{ marginTop: 20, padding: 24, background: '#f8fafc', borderRadius: 12 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>Nuevo método de pago</h3>
          <form onSubmit={handleAddMethod}>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Tipo</label>
                <select value={newMethod.type} onChange={e => setNewMethod({...newMethod, type: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                  <option value="card">Tarjeta de crédito</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                  <option value="googlepay">Google Pay</option>
                  <option value="applepay">Apple Pay</option>
                </select>
              </div>
              {newMethod.type === 'card' && (
                <>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Últimos 4 dígitos</label>
                    <input value={newMethod.details.last4} onChange={e => setNewMethod({...newMethod, details: {...newMethod.details, last4: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: 8 }} placeholder="4242" maxLength={4} />
                  </div>
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 600, display: 'block', marginBottom: 4 }}>Marca</label>
                    <select value={newMethod.details.brand} onChange={e => setNewMethod({...newMethod, details: {...newMethod.details, brand: e.target.value}})} style={{ width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Amex">American Express</option>
                    </select>
                  </div>
                </>
              )}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" checked={newMethod.isDefault} onChange={e => setNewMethod({...newMethod, isDefault: e.target.checked})} />
                  <span style={{ fontSize: 14 }}>Establecer como predeterminado</span>
                </label>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" style={{ padding: '10px 20px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Guardar</button>
                <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#e2e8f0', color: '#475569', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 24 }}>
        🔒 Puedes guardar hasta 3 métodos de pago. Tus datos están protegidos.
      </p>
    </div>
  );
}
