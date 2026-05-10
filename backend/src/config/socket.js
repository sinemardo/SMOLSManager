const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const logger = require('./config/logger');

let io = null;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:3001'],
      methods: ['GET', 'POST']
    }
  });

  // Middleware de autenticaci?n
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Token requerido'));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userId;
      socket.join('user:' + decoded.userId);
      next();
    } catch (err) {
      next(new Error('Token inv?lido'));
    }
  });

  io.on('connection', (socket) => {
    logger.info('Cliente conectado: ' + socket.userId);

    socket.on('disconnect', () => {
      logger.info('Cliente desconectado: ' + socket.userId);
    });
  });

  logger.info('WebSocket inicializado');
  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io no inicializado');
  return io;
}

// Enviar notificaci?n a un usuario espec?fico
function notifyUser(userId, event, data) {
  if (!io) return;
  io.to('user:' + userId).emit(event, data);
  logger.info('Notificacion enviada a ' + userId + ': ' + event);
}

// Enviar notificaci?n a todos los admins
function notifyAdmins(event, data) {
  if (!io) return;
  io.to('role:admin').emit(event, data);
}

module.exports = { initSocket, getIO, notifyUser, notifyAdmins };
