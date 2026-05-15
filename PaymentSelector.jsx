const paymentMethods = [
  { id: 'card', label: 'Tarjeta', icon: '💳' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️' },
  { id: 'stripe', label: 'Stripe', icon: '🔵' },
  { id: 'googlepay', label: 'Google Pay', icon: '📱' },
  { id: 'applepay', label: 'Apple Pay', icon: '🍎' }
];

export default function PaymentSelector({ selected, onSelect }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
      {paymentMethods.map(method => (
        <div key={method.id} onClick={() => onSelect(method.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderRadius: 16, cursor: 'pointer',
            border: selected === method.id ? '2px solid #6366f1' : '1px solid #e2e8f0',
            background: selected === method.id ? '#eef2ff' : '#fff', transition: 'all 0.2s'
          }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            border: selected === method.id ? '2px solid #6366f1' : '2px solid #d1d5db',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: selected === method.id ? '#6366f1' : '#fff', transition: 'all 0.2s'
          }}>
            {selected === method.id && <span style={{ color: '#fff', fontSize: 16, fontWeight: 700 }}>✓</span>}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span style={{ fontSize: 24 }}>{method.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{method.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
