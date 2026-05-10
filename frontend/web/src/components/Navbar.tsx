'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const { itemsCount } = useCart();
  const { buyer, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '0 16px', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 56 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 22 }}>🏪</span>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#4f46e5' }}>SMOLSManager</span>
          </Link>
          <Link href="/catalog" style={{ textDecoration: 'none', fontSize: 14, color: '#6b7280', fontWeight: 500 }}>Catálogo</Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Carrito */}
          <Link href="/cart" style={{ position: 'relative', textDecoration: 'none', fontSize: 22, padding: 8 }}>
            🛒
            {itemsCount > 0 && (
              <span style={{ position: 'absolute', top: 2, right: 2, background: '#dc2626', color: '#fff', fontSize: 11, fontWeight: 700, width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {itemsCount}
              </span>
            )}
          </Link>

          {/* Login / Perfil */}
          {buyer ? (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#374151' }}>
                {buyer.name?.split(' ')[0]} ▾
              </button>
              {menuOpen && (
                <div style={{ position: 'absolute', top: 40, right: 0, background: '#fff', borderRadius: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.15)', padding: 8, minWidth: 150, zIndex: 200 }}>
                  <Link href="/orders" style={{ display: 'block', padding: '10px 16px', textDecoration: 'none', color: '#374151', fontSize: 14 }}>📋 Mis Pedidos</Link>
                  <hr style={{ border: 'none', borderTop: '1px solid #e5e7eb', margin: '4px 0' }} />
                  <button onClick={() => { logout(); setMenuOpen(false); }} style={{ width: '100%', padding: '10px 16px', border: 'none', borderRadius: 8, background: '#fef2f2', color: '#dc2626', cursor: 'pointer', fontSize: 14, textAlign: 'left' }}>🚪 Salir</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" style={{ textDecoration: 'none', padding: '8px 16px', background: '#4f46e5', color: '#fff', borderRadius: 8, fontSize: 14, fontWeight: 500 }}>
              Iniciar Sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
