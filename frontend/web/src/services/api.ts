import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

export default api;

export const getCategories = async () => {
  const res = await api.get('/categories');
  return res;
};

export const getProducts = async (params?: any) => {
  const res = await api.get('/products', { params });
  return res;
};

export const getProduct = async (id: string) => {
  const res = await api.get('/products/' + id);
  return res;
};

export const loginBuyer = async (data: { email: string; password: string }) => {
  const res = await api.post('/auth/login', data);
  return res;
};

export const registerBuyer = async (data: any) => {
  const res = await api.post('/auth/register', data);
  return res;
};

export const createOrder = async (data: any) => {
  const res = await api.post('/orders', data);
  return res;
};

export const getOrders = async () => {
  const res = await api.get('/orders');
  return res;
};
