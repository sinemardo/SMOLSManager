import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PostsManager() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [editingPost, setEditingPost] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsRes, productsRes] = await Promise.all([
        api.get('/social/posts'),
        api.get('/products?limit=100')
      ]);
      setPosts(postsRes.data.posts || []);
      setProducts(productsRes.data.products || []);
    } catch (err) {
      console.error('Error cargando datos:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!confirm('Eliminar este post?')) return;
    try {
      await api.delete('/social/posts/' + postId);
      setMessage('Post eliminado');
      loadData();
    } catch (err) {
      setMessage('Error al eliminar');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Desactivar este producto?')) return;
    try {
      await api.delete('/products/' + productId);
      setMessage('Producto desactivado');
      loadData();
    } catch (err) {
      setMessage('Error al desactivar');
    }
  };

  const handleUpdateProduct = async (productId, data) => {
    try {
      await api.put('/products/' + productId, data);
      setMessage('Producto actualizado');
      setEditingProduct(null);
      loadData();
    } catch (err) {
      setMessage('Error al actualizar');
    }
  };

  const stats = {
    totalPosts: posts.length,
    totalProducts: products.length,
    convertedPosts: posts.filter(p => p.isConverted).length,
    pendingPosts: posts.filter(p => !p.isConverted).length,
    activeProducts: products.filter(p => p.isActive).length,
    totalViews: products.reduce((sum, p) => sum + (p.views || 0), 0)
  };

  const platformStats = [
    { name: 'Instagram', value: posts.filter(p => p.platform === 'instagram').length },
    { name: 'TikTok', value: posts.filter(p => p.platform === 'tiktok').length },
    { name: 'Facebook', value: posts.filter(p => p.platform === 'facebook').length },
    { name: 'Twitter', value: posts.filter(p => p.platform === 'twitter').length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">SMOLSManager</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/')} className="text-sm text-indigo-600 hover:text-indigo-800">Dashboard</button>
            <button onClick={() => navigate('/import')} className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">Importar</button>
            <span className="text-sm text-gray-600">{user?.name}</span>
            <button onClick={logout} className="text-sm text-red-500">Salir</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-2">Gestion de Posts y Productos</h2>
        <p className="text-gray-500 mb-6">Administra todos tus contenidos desde un solo lugar</p>

        {message && (
          <div className={`p-3 rounded-lg mb-4 ${message.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {message}
            <button onClick={() => setMessage('')} className="ml-4 text-sm underline">Cerrar</button>
          </div>
        )}

        {/* Stats rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-indigo-600">{stats.totalPosts}</p>
            <p className="text-xs text-gray-500">Posts</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-green-600">{stats.convertedPosts}</p>
            <p className="text-xs text-gray-500">Convertidos</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pendingPosts}</p>
            <p className="text-xs text-gray-500">Pendientes</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-purple-600">{stats.totalProducts}</p>
            <p className="text-xs text-gray-500">Productos</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.activeProducts}</p>
            <p className="text-xs text-gray-500">Activos</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-2xl font-bold text-pink-600">{stats.totalViews}</p>
            <p className="text-xs text-gray-500">Vistas</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button onClick={() => setActiveTab('posts')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'posts' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
            Posts ({posts.length})
          </button>
          <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
            Productos ({products.length})
          </button>
          <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 rounded-lg font-medium ${activeTab === 'stats' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}>
            Estadisticas
          </button>
        </div>

        {/* Tab: Posts */}
        {activeTab === 'posts' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Plataforma</th>
                  <th className="text-left py-3 px-4">Contenido</th>
                  <th className="text-left py-3 px-4">Likes</th>
                  <th className="text-left py-3 px-4">Estado</th>
                  <th className="text-left py-3 px-4">Fecha</th>
                  <th className="text-left py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {posts.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-400">No hay posts. Importa desde redes sociales.</td></tr>
                )}
                {posts.map(post => (
                  <tr key={post.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs uppercase">{post.platform}</span>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate">{post.caption || 'Sin descripcion'}</td>
                    <td className="py-3 px-4">❤️ {post.likes}</td>
                    <td className="py-3 px-4">
                      {post.isConverted ? (
                        <span className="text-green-600 text-xs">✅ Convertido</span>
                      ) : (
                        <span className="text-yellow-600 text-xs">⏳ Pendiente</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {!post.isConverted && (
                          <button onClick={() => navigate('/import')} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Convertir</button>
                        )}
                        <button onClick={() => handleDeletePost(post.id)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Eliminar</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Productos */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4">Producto</th>
                  <th className="text-left py-3 px-4">Categoria</th>
                  <th className="text-left py-3 px-4">Precio</th>
                  <th className="text-left py-3 px-4">Vistas</th>
                  <th className="text-left py-3 px-4">Origen</th>
                  <th className="text-left py-3 px-4">Estado</th>
                  <th className="text-left py-3 px-4">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 && (
                  <tr><td colSpan={7} className="py-8 text-center text-gray-400">No hay productos. Convierte posts o crea productos nuevos.</td></tr>
                )}
                {products.map(product => (
                  <tr key={product.id} className="border-t hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{product.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">{product.category?.displayName || 'Sin categoria'}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-green-600">€{product.price}</td>
                    <td className="py-3 px-4">{product.views || 0} 👁️</td>
                    <td className="py-3 px-4">
                      {product.socialPlatform ? (
                        <span className="text-xs text-indigo-600">{product.socialPlatform}</span>
                      ) : (
                        <span className="text-xs text-gray-400">Manual</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {product.isActive ? (
                        <span className="text-green-600 text-xs">✅ Activo</span>
                      ) : (
                        <span className="text-red-600 text-xs">❌ Inactivo</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button onClick={() => handleDeleteProduct(product.id)} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Desactivar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab: Estadísticas */}
        {activeTab === 'stats' && (
          <div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Posts por Plataforma</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Productos mas vistos</h3>
                {products.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5).map(p => (
                  <div key={p.id} className="flex justify-between py-2 border-b">
                    <span className="truncate">{p.name}</span>
                    <span className="font-bold">{p.views || 0} 👁️</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4">Resumen</h3>
                <div className="space-y-3">
                  <p>Tasa de conversion: {stats.totalPosts > 0 ? ((stats.convertedPosts / stats.totalPosts) * 100).toFixed(1) : 0}%</p>
                  <p>Productos activos: {stats.activeProducts} de {stats.totalProducts}</p>
                  <p>Posts pendientes: {stats.pendingPosts}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
