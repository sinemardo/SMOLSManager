'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api, { login as loginApi } from '@/services/api';

interface Buyer {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  buyer: Buyer | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [buyer, setBuyer] = useState<Buyer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('buyer_token');
    if (token) {
      api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      api.get('/auth/me')
        .then(res => setBuyer(res.data.user))
        .catch(() => localStorage.removeItem('buyer_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await loginApi({ email, password });
    localStorage.setItem('buyer_token', res.data.accessToken);
    api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.accessToken;
    setBuyer(res.data.user);
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('buyer_token', res.data.accessToken);
    api.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.accessToken;
    setBuyer(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('buyer_token');
    localStorage.removeItem('buyer_cart');
    setBuyer(null);
  };

  return (
    <AuthContext.Provider value={{ buyer, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
