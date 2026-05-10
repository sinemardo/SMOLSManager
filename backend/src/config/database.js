const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Mongoose 8+ usa estas opciones por defecto
    });
    console.log(MongoDB conectado: );
  } catch (error) {
    console.error(Error de conexión a MongoDB: );
    process.exit(1);
  }
};

module.exports = connectDB;
