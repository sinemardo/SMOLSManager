import axios from 'axios';

const API_URL = 'http://10.0.2.2:3000/api/v1'; // Android emulator localhost

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('smols_token');
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (data) => api.post('/auth/register', data);
export const getCategories = () => api.get('/categories');
export const getProducts = (params) => api.get('/products', { params });
export const getDashboard = () => api.get('/kpis/dashboard');

export default api;
