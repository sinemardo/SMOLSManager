import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import ToastProvider from '../components/ui/Toast';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('smols_token', data.accessToken);
      localStorage.setItem('smols_user', JSON.stringify(data.user));
      toast.success('¡Bienvenido de vuelta!');
      setTimeout(() => { window.location.href = '/'; }, 500);
    } catch (err) {
      toast.error('Email o contraseña incorrectos');
      setLoading(false);
    }
  };

  return (
    <>
      <ToastProvider />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-3xl">🏪</span>
          </motion.div>
          
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">SMOLSManager</h1>
          <p className="text-center text-gray-500 text-sm mb-8">Gestiona tu tienda desde redes sociales</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                placeholder="tu@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
                placeholder="••••••••"
                required
              />
            </div>
            <Button type="submit" loading={loading} className="w-full" size="lg">
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{' '}
            <a href="/register" className="text-indigo-600 font-medium hover:text-indigo-700">
              Regístrate gratis
            </a>
          </p>
        </motion.div>
      </div>
    </>
  );
}
