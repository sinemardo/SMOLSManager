const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(128).required(),
  name: Joi.string().trim().min(2).max(100).required(),
  storeName: Joi.string().trim().max(100).optional(),
  categoryId: Joi.string().optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const productSchema = Joi.object({
  name: Joi.string().trim().min(3).max(200).required(),
  description: Joi.string().max(2000).optional(),
  price: Joi.number().min(0).required(),
  categoryId: Joi.string().required(),
  postUrl: Joi.string().uri().optional(),
  socialPlatform: Joi.string().valid('instagram', 'facebook', 'tiktok', 'twitter', 'other').optional(),
  stock: Joi.number().integer().min(0).default(1),
  tags: Joi.array().items(Joi.string().trim()).optional(),
  images: Joi.array().items(Joi.object({
    url: Joi.string().uri().required(),
    alt: Joi.string().optional()
  })).optional()
});

const orderSchema = Joi.object({
  products: Joi.array().items(Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required()
  })).min(1).required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required()
  }).optional(),
  notes: Joi.string().max(500).optional()
});

const categorySchema = Joi.object({
  name: Joi.string().trim().lowercase().required(),
  displayName: Joi.string().trim().required(),
  description: Joi.string().max(500).optional(),
  icon: Joi.string().optional()
});

module.exports = {
  registerSchema,
  loginSchema,
  productSchema,
  orderSchema,
  categorySchema
};
