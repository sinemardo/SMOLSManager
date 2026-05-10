import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function ImportPost() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [platform, setPlatform] = useState('instagram');
  const [postUrl, setPostUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadPosts();
    api.get('/categories').then(r => setCategories(r.data.categories));
  }, []);

  const loadPosts = () => {
    api.get('/social/posts').then(r => setPosts(r.data.posts));
  };

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      await api.post('/social/import', { platform, postUrl, caption });
      setMessage('Post importado exitosamente');
      setPostUrl('');
      setCaption('');
      loadPosts();
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.message || 'Error al importar'));
    }
  };

  const handleConvert = async (postId, name, price, categoryId) => {
    try {
      await api.post('/social/convert/' + postId, { name, price, categoryId });
      setMessage('Producto creado desde post');
      loadPosts();
    } catch (err) {
      setMessage('Error al convertir');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">SMOLSManager</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-sm text-indigo-600">Dashboard</button>
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button onClick={logout} className="text-sm text-red-500">Salir</button>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Importar Post de Red Social</h2>

        {message && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">{message}</div>}

        <form onSubmit={handleImport} className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Plataforma</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full border rounded-lg px-3 py-2">
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="twitter">Twitter</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL del Post</label>
              <input type="text" value={postUrl} onChange={e => setPostUrl(e.target.value)} className="w-full border rounded-lg px-3 py-2" placeholder="https://..." />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea value={caption} onChange={e => setCaption(e.target.value)} className="w-full border rounded-lg px-3 py-2" rows={3} placeholder="Descripción del producto..." />
            </div>
          </div>
          <button type="submit" className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">Importar Post</button>
        </form>

        <h3 className="text-xl font-bold mb-4">Posts Importados</h3>
        <div className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">{post.platform}</span>
                <p className="mt-1">{post.caption?.substring(0, 100)}</p>
                <p className="text-xs text-gray-500">❤️ {post.likes} | 💬 {post.comments}</p>
              </div>
              {!post.isConverted ? (
                <ConvertButton post={post} categories={categories} onConvert={handleConvert} />
              ) : (
                <span className="text-green-600 text-sm">✅ Convertido</span>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ConvertButton({ post, categories, onConvert }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState(post.caption || '');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');

  if (!show) return <button onClick={() => setShow(true)} className="bg-green-600 text-white px-3 py-1 rounded text-sm">Convertir a Producto</button>;

  return (
    <div className="flex flex-col gap-2">
      <input type="text" value={name} onChange={e => setName(e.target.value)} className="border rounded px-2 py-1 text-sm" placeholder="Nombre" />
      <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="border rounded px-2 py-1 text-sm" placeholder="Precio" />
      <select value={categoryId} onChange={e => setCategoryId(e.target.value)} className="border rounded px-2 py-1 text-sm">
        <option value="">Categoría</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.displayName}</option>)}
      </select>
      <button onClick={() => onConvert(post.id, name, price, categoryId)} className="bg-green-600 text-white px-2 py-1 rounded text-sm">Convertir</button>
    </div>
  );
}
