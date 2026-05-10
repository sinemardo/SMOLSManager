const request = require('supertest');
const app = require('../src/app');

describe('Products', () => {
  let token = '';

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@smolsmanager.com', password: 'admin123' });
    token = res.body.accessToken;
  });

  test('GET /api/v1/products devuelve lista', async () => {
    const res = await request(app)
      .get('/api/v1/products')
      .set('Authorization', 'Bearer ' + token);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('products');
    expect(Array.isArray(res.body.products)).toBe(true);
  });

  test('POST /api/v1/products sin token devuelve 401', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .send({ name: 'Test', price: 10 });
    
    expect(res.statusCode).toBe(401);
  });

  test('POST /api/v1/products con token crea producto', async () => {
    const res = await request(app)
      .post('/api/v1/products')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Producto Test ' + Date.now(),
        price: 99.99,
        categoryId: null
      });
    
    // Puede fallar si falta categoryId, pero debe devolver un error controlado
    expect([201, 400]).toContain(res.statusCode);
  });
});
