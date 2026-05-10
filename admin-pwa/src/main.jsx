import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Si no hay token, redirigir directamente al login
const token = localStorage.getItem('smols_token');
if (!token && window.location.pathname !== '/login') {
  window.location.href = '/login';
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
