const request = require('supertest');
const app = require('../src/app');

describe('Health Check', () => {
  test('GET /api/v1/health devuelve status ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('SMOLSManager API');
  });

  test('GET / devuelve mensaje de bienvenida', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('SMOLSManager API');
    expect(res.body.version).toBe('1.0.0');
  });

  test('Ruta no encontrada devuelve 404', async () => {
    const res = await request(app).get('/api/v1/no-existe');
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe('Ruta no encontrada');
  });
});
