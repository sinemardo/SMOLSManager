import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ImportPost = lazy(() => import('./pages/ImportPost'));
const PostsManager = lazy(() => import('./pages/PostsManager'));

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('smols_token'));

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Cargando...</div>}>
        <Routes>
          <Route path="/login" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
          <Route path="/register" element={<Register onRegister={() => setIsLoggedIn(true)} />} />
          <Route path="/import" element={isLoggedIn ? <ImportPost /> : <Navigate to="/login" />} />
          <Route path="/posts" element={isLoggedIn ? <PostsManager /> : <Navigate to="/login" />} />
          <Route path="/" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
