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
    expect(res.body.user.email).toBe(testUser.email);
  });

  test('POST /api/v1/auth/login con credenciales correctas', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@smolsmanager.com', password: 'admin123' });
    
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Login exitoso');
    expect(res.body).toHaveProperty('accessToken');
  });

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
