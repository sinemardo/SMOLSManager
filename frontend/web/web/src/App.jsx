import { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:3000/api/v1';

export default function App() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    axios.get(API + '/categories').then(r => setCategories(r.data.categories));
    loadProducts();
  }, []);

  const loadProducts = (cat = '') => {
    axios.get(API + '/products' + (cat ? '?category=' + cat : '')).then(r => setProducts(r.data.products));
  };

  const filterByCategory = (catId) => {
    setSelectedCategory(catId);
    loadProducts(catId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <h1 className="text-5xl font-bold mb-4">SMOLSManager</h1>
          <p className="text-xl">Social Media OnLine Shop Management</p>
          <p className="mt-4 opacity-75">Descubre productos de vendedores en redes sociales</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-2 mb-8">
          <button onClick={() => filterByCategory('')} className={`px-4 py-2 rounded-full text-sm ${!selectedCategory ? 'bg-indigo-600 text-white' : 'bg-white'}`}>Todas</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => filterByCategory(cat.id)} className={`px-4 py-2 rounded-full text-sm ${selectedCategory === cat.id ? 'bg-indigo-600 text-white' : 'bg-white'}`}>
              {cat.displayName}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow hover:shadow-md transition p-4">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{p.description?.substring(0, 100)}</p>
              <div className="flex justify-between items-center mt-3">
                <span className="text-xl font-bold text-indigo-600">€{p.price}</span>
                <span className="text-xs text-gray-400">{p.seller?.storeName}</span>
              </div>
              <span className="inline-block mt-2 px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs">{p.category?.displayName}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
