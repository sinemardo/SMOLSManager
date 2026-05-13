const prisma = require('../utils/prisma');
const logger = require('../config/logger');

// ... (mantener createPaymentIntent, confirmPayment simulados)

// Obtener métodos de pago del usuario
exports.getPaymentMethods = async (req, res) => {
  try {
    const methods = await prisma.paymentMethod.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ methods });
  } catch (error) { next(error); }
};

// Añadir nuevo método de pago (máximo 3)
exports.addPaymentMethod = async (req, res, next) => {
  try {
    const { type, details, isDefault } = req.body;
    
    // Validar máximo 3 métodos
    const count = await prisma.paymentMethod.count({ where: { userId: req.user.id } });
    if (count >= 3) {
      return res.status(400).json({ message: 'Máximo 3 métodos de pago permitidos' });
    }

    // Si se marca como predeterminado, desmarcar otros
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false }
      });
    }

    const method = await prisma.paymentMethod.create({
      data: {
        userId: req.user.id,
        type: type || 'card',
        details: details || {},
        isDefault: isDefault || false
      }
    });

    logger.info('Método de pago añadido: ' + method.id);
    res.status(201).json({ method, message: 'Método de pago añadido correctamente' });
  } catch (error) { next(error); }
};

// Establecer método predeterminado
exports.setDefaultPaymentMethod = async (req, res, next) => {
  try {
    const { methodId } = req.params;
    
    await prisma.paymentMethod.updateMany({
      where: { userId: req.user.id },
      data: { isDefault: false }
    });
    
    const method = await prisma.paymentMethod.update({
      where: { id: methodId },
      data: { isDefault: true }
    });

    res.json({ method, message: 'Método predeterminado actualizado' });
  } catch (error) { next(error); }
};

// Eliminar método de pago
exports.deletePaymentMethod = async (req, res, next) => {
  try {
    await prisma.paymentMethod.delete({ where: { id: req.params.methodId } });
    res.json({ message: 'Método eliminado' });
  } catch (error) { next(error); }
};

// Mantenemos los endpoints anteriores (createPaymentIntent, confirmPayment)
exports.createPaymentIntent = async (req, res, next) => {
  // ... igual que antes
};
exports.confirmPayment = async (req, res, next) => {
  // ... igual que antes
};
