require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/database');
const logger = require('./config/logger');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    logger.info('Conexión a MongoDB establecida');

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(🚀 SMOLSManager API corriendo en http://localhost:);
      logger.info(📚 Documentación: http://localhost:/api-docs);
    });
  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
