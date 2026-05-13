export default function PaymentMethodCard({ method, onSetDefault, onDelete }) {
  const icons = {
    card: '💳',
    paypal: '🅿️',
    stripe: '🔵',
    googlepay: '📱',
    applepay: '🍎'
  };

  const labels = {
    card: 'Tarjeta',
    paypal: 'PayPal',
    stripe: 'Stripe',
    googlepay: 'Google Pay',
    applepay: 'Apple Pay'
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: 20, background: '#fff', borderRadius: 16,
      border: method.isDefault ? '2px solid #6366f1' : '1px solid #e2e8f0',
      boxShadow: method.isDefault ? '0 8px 20px rgba(99,102,241,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
      transition: 'all 0.2s'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: '#eef2ff',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28
        }}>
          {icons[method.type] || '💳'}
        </div>
        <div>
          <p style={{ fontWeight: 700, fontSize: 15, color: '#1f2937' }}>
            {labels[method.type] || method.type}
          </p>
          {method.type === 'card' && (
            <p style={{ fontSize: 13, color: '#64748b', marginTop: 2 }}>
              {method.details?.brand || 'Tarjeta'} ···· {method.details?.last4 || '****'}
            </p>
          )}
          {method.isDefault && (
            <span style={{
              display: 'inline-block', marginTop: 6, padding: '3px 10px',
              background: '#eef2ff', color: '#6366f1', borderRadius: 20,
              fontSize: 11, fontWeight: 600
            }}>Predeterminado</span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        {!method.isDefault && (
          <button onClick={() => onSetDefault(method.id)}
            style={{
              padding: '8px 14px', border: '1px solid #6366f1', color: '#6366f1',
              background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500
            }}>
            Establecer por defecto
          </button>
        )}
        <button onClick={() => onDelete(method.id)}
          style={{
            padding: '8px', border: 'none', background: '#fef2f2', color: '#dc2626',
            borderRadius: 8, cursor: 'pointer', fontSize: 16
          }}>🗑️</button>
      </div>
    </div>
  );
}
