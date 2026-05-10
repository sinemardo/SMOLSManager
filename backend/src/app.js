require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');
const logger = require('./config/logger');
const errorHandler = require('./middleware/errorHandler');

// Importar rutas
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const kpiRoutes = require('./routes/kpis');
const healthRoutes = require('./routes/health');

const app = express();

// ============================================
// Middleware de seguridad básica
// ============================================
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://smolsmanager.com',
    'https://admin.smolsmanager.com'
  ],
  credentials: true
}));

// Rate limiting global
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100,
  message: { message: 'Demasiadas peticiones, intenta de nuevo más tarde' }
});
app.use(limiter);

// ============================================
// Parsers y logging
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// ============================================
// Documentación Swagger
// ============================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ============================================
// Rutas API v1
// ============================================
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/kpis', kpiRoutes);
app.use('/api/v1/health', healthRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'SMOLSManager API',
    version: '1.0.0',
    documentation: '/api-docs',
    health: '/api/v1/health'
  });
});

// ============================================
// Manejo de errores
// ============================================
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});
app.use(errorHandler);

module.exports = app;
