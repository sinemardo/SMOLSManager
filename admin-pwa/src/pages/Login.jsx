import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('smols_token', data.accessToken);
      localStorage.setItem('smols_user', JSON.stringify(data.user));
      onLogin();
    } catch (err) {
      setError('Error al iniciar sesion');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-2">SMOLSManager</h1>
        <p className="text-center text-gray-500 mb-6">Social Media OnLine Shop Management</p>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="tu@email.com" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-2 border rounded-lg" placeholder="Contrasena" required />
          <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Iniciar Sesion</button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          <Link to="/register" className="text-indigo-600 hover:underline">Registrate</Link>
        </p>
      </div>
    </div>
  );
}
