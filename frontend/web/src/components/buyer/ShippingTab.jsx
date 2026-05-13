import { useState } from 'react';

export default function ShippingTab({ shipping, setShipping }) {
  const [addresses, setAddresses] = useState(() => {
    const saved = localStorage.getItem('buyer_addresses');
    return saved ? JSON.parse(saved) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [form, setForm] = useState({ address: '', city: '', state: '', zip: '', country: '' });

  const maxAddresses = 3;

  function saveAddress(e) {
    e.preventDefault();
    let newAddresses = [...addresses];
    if (editingIndex !== null) {
      newAddresses[editingIndex] = { ...form };
    } else {
      if (newAddresses.length >= maxAddresses) {
        alert(`Solo puedes guardar hasta ${maxAddresses} direcciones.`);
        return;
      }
      newAddresses.push({ ...form });
    }
    setAddresses(newAddresses);
    localStorage.setItem('buyer_addresses', JSON.stringify(newAddresses));
    setForm({ address: '', city: '', state: '', zip: '', country: '' });
    setEditingIndex(null);
  }

  function editAddress(index) {
    setForm(addresses[index]);
    setEditingIndex(index);
  }

  function deleteAddress(index) {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
    localStorage.setItem('buyer_addresses', JSON.stringify(newAddresses));
  }

  function setAsDefault(index) {
    const newAddresses = addresses.map((addr, i) => ({ ...addr, isDefault: i === index }));
    setAddresses(newAddresses);
    localStorage.setItem('buyer_addresses', JSON.stringify(newAddresses));
    // También actualizar el estado global shipping para el checkout
    setShipping(newAddresses[index]);
  }

  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>🚚 Direcciones de Envío</h2>
      <p style={{ color: '#64748b', marginBottom: 24, fontSize: 14 }}>Guarda hasta {maxAddresses} direcciones. Selecciona una como predeterminada para tus pedidos.</p>

      {/* Lista de direcciones guardadas */}
      {addresses.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          {addresses.map((addr, index) => (
            <div key={index} style={{ padding: 16, marginBottom: 12, background: addr.isDefault ? '#eef2ff' : '#f8fafc', borderRadius: 12, border: addr.isDefault ? '2px solid #6366f1' : '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{addr.address}</p>
                  <p style={{ fontSize: 13, color: '#64748b' }}>{addr.city}, {addr.state} {addr.zip}, {addr.country}</p>
                  {addr.isDefault && <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 10px', background: '#6366f1', color: '#fff', borderRadius: 20, fontSize: 11 }}>Predeterminada</span>}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {!addr.isDefault && (
                    <button onClick={() => setAsDefault(index)} style={{ padding: '6px 12px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>★</button>
                  )}
                  <button onClick={() => editAddress(index)} style={{ padding: '6px 12px', background: '#e2e8f0', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>✏️</button>
                  <button onClick={() => deleteAddress(index)} style={{ padding: '6px 12px', background: '#fef2f2', color: '#dc2626', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>🗑️</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulario para añadir/editar */}
      <form onSubmit={saveAddress} style={{ maxWidth: 500 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>{editingIndex !== null ? 'Editar dirección' : 'Nueva dirección'}</h3>
        <div style={{ display: 'grid', gap: 16 }}>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Dirección</label><input value={form.address} onChange={e => setForm({...form, address: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="Calle y número" required /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Ciudad</label><input value={form.city} onChange={e => setForm({...form, city: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} required /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Provincia/Estado</label><input value={form.state} onChange={e => setForm({...form, state: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Código Postal</label><input value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} required /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>País</label><input value={form.country} onChange={e => setForm({...form, country: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} required /></div>
          </div>
        </div>
        <button type="submit" style={{ padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 16 }}>
          {editingIndex !== null ? '💾 Guardar cambios' : '➕ Añadir dirección'}
        </button>
        {editingIndex !== null && (
          <button onClick={() => { setForm({ address: '', city: '', state: '', zip: '', country: '' }); setEditingIndex(null); }} style={{ marginLeft: 8, padding: '14px', background: '#e2e8f0', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 16 }}>
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}
