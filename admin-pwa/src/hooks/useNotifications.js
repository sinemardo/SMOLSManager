import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export function useNotifications(userId, token) {
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    const socket = io('http://localhost:3000', {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Conectado a notificaciones');
    });

    socket.on('order:new', (data) => {
      console.log('Nueva orden:', data);
      if (Notification.permission === 'granted') {
        new Notification('Nueva Orden', {
          body: 'Por ' + data.buyer + ' - Total: ' + data.total,
          icon: '/vite.svg'
        });
      }
    });

    socket.on('post:imported', (data) => {
      console.log('Post importado:', data);
    });

    socket.on('post:converted', (data) => {
      console.log('Producto creado:', data);
    });

    socket.on('disconnect', () => {
      console.log('Desconectado');
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return socketRef;
}
