export default function ShippingTab({ shipping, setShipping }) {
  return (
    <div style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>🚚 Dirección de Envío</h2>
      <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14 }}>Guarda tu dirección para recibir tus pedidos.</p>
      <form onSubmit={(e) => { e.preventDefault(); alert('Dirección guardada correctamente.'); }} style={{ maxWidth: 500 }}>
        <div style={{ display: 'grid', gap: 16 }}>
          <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Dirección</label><input value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} placeholder="Calle y número" /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Ciudad</label><input value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Provincia/Estado</label><input value={shipping.state} onChange={e => setShipping({...shipping, state: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} /></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>Código Postal</label><input value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>País</label><input value={shipping.country} onChange={e => setShipping({...shipping, country: e.target.value})} style={{ width: '100%', padding: '12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} /></div>
          </div>
          <button type="submit" style={{ padding: '14px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 }}>💾 Guardar dirección</button>
        </div>
      </form>
    </div>
  );
}
