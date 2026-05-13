import { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileTab from '../components/buyer/ProfileTab';
import CartTab from '../components/buyer/CartTab';
import WishlistTab from '../components/buyer/WishlistTab';
import OrdersTab from '../components/buyer/OrdersTab';
import ShippingTab from '../components/buyer/ShippingTab';
import PaymentTab from '../components/buyer/PaymentTab';
import CheckoutPortal from '../components/buyer/CheckoutPortal';

const API = 'http://localhost:3000/api/v1';

export default function BuyerPortal({ user, onBack, initialTab = 'profile' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(localStorage.getItem('buyer_avatar') || '');
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });
  const [shipping, setShipping] = useState(() => {
    const saved = localStorage.getItem('buyer_shipping');
    return saved ? JSON.parse(saved) : { address: '', city: '', state: '', zip: '', country: '' };
  });
  const [payment, setPayment] = useState(() => {
    const saved = localStorage.getItem('buyer_payment');
    return saved ? JSON.parse(saved) : { cardNumber: '', expiry: '', cvv: '', name: '' };
  });

  useEffect(() => {
    const token = localStorage.getItem('smols_token');
    if (token) {
      axios.get(API + '/orders', { headers: { Authorization: 'Bearer ' + token } })
        .then(r => setOrders(r.data.orders || []))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
    const savedWish = localStorage.getItem('buyer_wishlist');
    if (savedWish) setWishlist(JSON.parse(savedWish));
    const savedCart = localStorage.getItem('buyer_cart'); if (savedCart) setCart(JSON.parse(savedCart));
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => { localStorage.setItem('buyer_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('buyer_cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('buyer_shipping', JSON.stringify(shipping)); }, [shipping]);
  useEffect(() => { localStorage.setItem('buyer_payment', JSON.stringify(payment)); }, [payment]);

  const tabs = [
    { id: 'profile', label: '👤 Perfil', count: null },
    { id: 'cart', label: '🛒 Mi Carrito', count: cart.reduce((s, i) => s + (i.quantity || 1), 0) },
    { id: 'wishlist', label: '❤️ Favoritos', count: wishlist.length },
    { id: 'orders', label: '📋 Historial', count: orders.length },
    { id: 'shipping', label: '🚚 Envíos', count: null },
    { id: 'payment', label: '💳 Pagos', count: null }
  ];

  function updateCartQty(id, qty) {
    if (qty <= 0) { setCart(prev => prev.filter(i => i.productId !== id)); return; }
    setCart(prev => prev.map(i => i.productId === id ? { ...i, quantity: qty } : i));
  }
  function removeFromCart(id) { setCart(prev => prev.filter(i => i.productId !== id)); }
  function removeFromWishlist(id) { setWishlist(prev => prev.filter(i => i.productId !== id)); }
  function moveToWishlist(item) {
    setWishlist(prev => [...prev, { productId: item.productId, name: item.name, price: item.price }]);
    removeFromCart(item.productId);
  }
  function addToCartFromWishlist(item) {
    setCart(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) return prev.map(i => i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    removeFromWishlist(item.productId);
  }

  const cartTotal = cart.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <nav style={{ background: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid #e2e8f0' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer', fontWeight: 600, color: '#6366f1' }}>← Volver a la tienda</button>
        <span style={{ fontWeight: 700, fontSize: 18, color: '#1f2937' }}>Mi Portal</span>
      </nav>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 32 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginBottom: 32 }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 10px', border: 'none', borderRadius: 12, fontWeight: 600, fontSize: 13, cursor: 'pointer',
                background: activeTab === tab.id ? '#6366f1' : '#fff', color: activeTab === tab.id ? '#fff' : '#475569',
                boxShadow: activeTab === tab.id ? '0 8px 20px rgba(99,102,241,0.3)' : '0 1px 3px rgba(0,0,0,0.04)'
              }}>
              {tab.label} {tab.count !== null ? '(' + tab.count + ')' : ''}
            </button>
          ))}
        </div>
        {activeTab === 'profile' && <ProfileTab profile={profile} setProfile={setProfile} profileImage={profileImage} setProfileImage={setProfileImage} />}
        {activeTab === 'cart' && <CartTab cart={cart} setCart={setCart} updateCartQty={updateCartQty} removeFromCart={removeFromCart} moveToWishlist={moveToWishlist} cartTotal={cartTotal} onCheckout={() => setShowCheckout(true)} />}
        {activeTab === 'wishlist' && <WishlistTab wishlist={wishlist} addToCartFromWishlist={addToCartFromWishlist} removeFromWishlist={removeFromWishlist} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} loading={loading} />}
        {activeTab === 'shipping' && <ShippingTab shipping={shipping} setShipping={setShipping} />}
        {activeTab === 'payment' && <PaymentTab payment={payment} setPayment={setPayment} />}
      </div>
    </div>
  );
}



