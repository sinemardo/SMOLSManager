import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ImportPost from './pages/ImportPost';
import CreateProduct from './pages/CreateProduct';
import PostsManager from './pages/PostsManager';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import StoreProfile from './pages/StoreProfile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function App() {
  const token = localStorage.getItem('smols_token');

  if (window.location.pathname === '/login') {
    return token ? <Navigate to="/" /> : <Login />;
  }

  if (!token) {
    window.location.href = '/login';
    return null;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/import" element={<ImportPost />} />
        <Route path="/create" element={<CreateProduct />} />
        <Route path="/posts" element={<PostsManager />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<ProductDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/profile" element={<StoreProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
