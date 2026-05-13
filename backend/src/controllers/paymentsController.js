const prisma = require('../utils/prisma');
const logger = require('../config/logger');

// Simular creación de intención de pago (Stripe, PayPal, etc.)
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'eur', gateway } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Monto inválido' });
    }

    // Simular respuesta de pasarela
    const intent = {
      id: 'pi_' + Date.now(),
      amount,
      currency,
      gateway: gateway || 'card',
      status: 'requires_payment_method',
      clientSecret: 'seti_' + Math.random().toString(36).substr(2),
      createdAt: new Date().toISOString()
    };

    logger.info('Intención de pago creada: ' + intent.id);
    res.json({ intent });
  } catch (error) { next(error); }
};

// Simular confirmación de pago
exports.confirmPayment = async (req, res, next) => {
  try {
    const { paymentIntentId, paymentMethod } = req.body;
    if (!paymentIntentId) {
      return res.status(400).json({ message: 'Falta ID de intención de pago' });
    }

    // Simular confirmación exitosa
    const payment = {
      id: 'pay_' + Date.now(),
      paymentIntentId,
      status: 'succeeded',
      amount: req.body.amount || 0,
      gateway: paymentMethod || 'card',
      createdAt: new Date().toISOString()
    };

    logger.info('Pago confirmado: ' + payment.id);
    res.json({ payment, message: 'Pago procesado correctamente' });
  } catch (error) { next(error); }
};

// Obtener métodos de pago guardados (simulación)
exports.getPaymentMethods = async (req, res) => {
  const methods = [
    { id: 'card', type: 'card', last4: '4242', brand: 'Visa', isDefault: true },
    { id: 'paypal', type: 'paypal', email: req.user.email, isDefault: false }
  ];
  res.json({ methods });
};
