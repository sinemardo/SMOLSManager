export default function PaymentMethodCard({ method, onSetDefault, onDelete }) {
  const icons = { card: '💳', paypal: '🅿️', stripe: '🔵', googlepay: '📱', applepay: '🍎' };
  const labels = { card: 'Tarjeta', paypal: 'PayPal', stripe: 'Stripe', googlepay: 'Google Pay', applepay: 'Apple Pay' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#f8fafc', borderRadius: 12, border: method.isDefault ? '2px solid #6366f1' : '1px solid #e2e8f0' }}>
      <span style={{ fontSize: 24 }}>{icons[method.type] || '💳'}</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, fontSize: 14 }}>{labels[method.type] || method.type}</p>
        {method.type === 'card' && method.details?.last4 && (
          <p style={{ fontSize: 12, color: '#64748b' }}>{method.details.brand} ···· {method.details.last4}</p>
        )}
      </div>
      {method.isDefault ? (
        <span style={{ background: '#eef2ff', color: '#6366f1', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Predeterminado</span>
      ) : (
        <button onClick={() => onSetDefault(method.id)} style={{ padding: '6px 12px', border: '1px solid #6366f1', color: '#6366f1', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 500 }}>Establecer por defecto</button>
      )}
      <button onClick={() => onDelete(method.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
    </div>
  );
}
