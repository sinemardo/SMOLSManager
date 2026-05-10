require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');
const performanceMonitor = require('./middleware/performanceMonitor');

const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const kpiRoutes = require('./routes/kpis');
const healthRoutes = require('./routes/health');
const socialRoutes = require('./routes/social');

const app = express();

// Seguridad
app.use(helmet());
app.use(cors());
app.use(rateLimit({ windowMs: 60000, max: 100 }));

// Monitoreo
app.use(performanceMonitor);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/kpis', kpiRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/social', socialRoutes);

app.get('/', (req, res) => res.json({ message: 'SMOLSManager API', version: '1.0.0' }));
app.use((req, res) => res.status(404).json({ message: 'Ruta no encontrada' }));
app.use(errorHandler);

module.exports = app;
