import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ImportPost from './pages/ImportPost';
import PostsManager from './pages/PostsManager';
import Catalog from './pages/Catalog';
import StoreProfile from './pages/StoreProfile';
import Orders from './pages/Orders';

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
        <Route path="/import" element={<ImportPost />} />
        <Route path="/posts" element={<PostsManager />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/profile" element={<StoreProfile />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
