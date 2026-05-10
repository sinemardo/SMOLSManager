import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [form, setForm] = useState({ email: '', password: '', name: '', storeName: '', categoryId: '' });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const { register } = useAuth();

  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.categories));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">SMOLSManager</h1>
        <p className="text-center text-gray-500 mb-6">Crear cuenta de vendedor</p>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nombre completo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
          <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
          <input type="password" placeholder="Contraseña (mín 8 caracteres)" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required minLength={8} />
          <input type="text" placeholder="Nombre de la tienda" value={form.storeName} onChange={e => setForm({...form, storeName: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
          <select value={form.categoryId} onChange={e => setForm({...form, categoryId: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required>
            <option value="">Selecciona tu categoría</option>
            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.displayName}</option>)}
          </select>
          <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Registrarse</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tienes cuenta? <Link to="/login" className="text-indigo-600 hover:underline">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
