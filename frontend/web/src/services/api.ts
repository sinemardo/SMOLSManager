import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Añadir token si existe
if (typeof window !== 'undefined') {
  const token = localStorage.getItem('buyer_token');
  if (token) {
    api.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  }
}

export const register = (data: any) => api.post('/auth/register', data);
export const login = (data: any) => api.post('/auth/login', data);
export const getCategories = () => api.get('/categories');
export const getProducts = (params?: any) => api.get('/products', { params });
export const getProduct = (id: string) => api.get('/products/' + id);
export const createOrder = (data: any) => api.post('/orders', data);
export const getOrders = () => api.get('/orders');

export default api;
