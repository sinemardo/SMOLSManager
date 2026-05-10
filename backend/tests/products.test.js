const request = require('supertest');
const app = require('../src/app');

describe('Products', () => {
  let token = '';
  let categoryId = '';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@smolsmanager.com', password: 'admin123' });
    token = res.body.accessToken;

    // Obtener primera categoría
    const cats = await request(app).get('/api/v1/categories');
    if (cats.body.categories.length > 0) {
      categoryId = cats.body.categories[0].id;
    }
  });

  test('GET /api/v1/products devuelve lista', async () => {
    const res = await request(app)
      .get('/api/v1/products')
      .set('Authorization', 'Bearer ' + token);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('products');
  });

  test('POST /api/v1/products sin token devuelve 401', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({ name: 'Test', price: 10 });
    
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/v1/products con token crea producto', async () => {
    if (!categoryId) {
      console.log('No hay categorias disponibles, saltando test');
      return;
    }
    
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Producto Test ' + Date.now(),
        price: 99.99,
        categoryId: categoryId
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('product');
    expect(res.body.message).toBe('Producto creado');
  });
});
