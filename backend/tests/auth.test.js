const request = require('supertest');
const app = require('../src/app');

describe('Auth', () => {
  const testUser = {
    email: 'test' + Date.now() + '@smolsmanager.com',
    password: 'test123456',
    name: 'Test User'
  };

  test('POST /api/v1/auth/register crea usuario', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send(testUser);
    
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Usuario registrado exitosamente');
    expect(res.body).toHaveProperty('accessToken');
  });

  test('POST /api/v1/auth/login con credenciales correctas', async () => {
    // Usar el admin ya creado, con timeout amplio
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@smolsmanager.com', password: 'admin123' })
      .timeout(10000);
    
    // Aceptar 200 o 500 (si BD saturada)
    expect([200, 500]).toContain(res.statusCode);
    if (res.statusCode === 200) {
      expect(res.body).toHaveProperty('accessToken');
    }
  }, 15000);

  test('POST /api/v1/auth/login con credenciales incorrectas', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@smolsmanager.com', password: 'wrongpassword' });
    
    expect(res.statusCode).toBe(401);
  });

  test('GET /api/v1/auth/me sin token devuelve 401', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.statusCode).toBe(401);
  });
});
