require("dotenv").config();
const app = require("./app");
const { PrismaClient } = require("@prisma/client");
const logger = require("./config/logger");

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Conexion a PostgreSQL establecida");

    app.listen(PORT, () => {
      logger.info("SMOLSManager API corriendo en http://localhost:" + PORT);
      logger.info("Documentacion: http://localhost:" + PORT + "/api-docs");
    });
  } catch (error) {
    logger.error("Error al iniciar el servidor: " + error.message);
    process.exit(1);
  }
};

startServer();
