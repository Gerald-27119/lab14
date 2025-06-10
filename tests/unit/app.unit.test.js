const request = require('supertest');
const app = require('../../app');

describe('Unit Test: GET /', () => {
  it('powinno zwrócić 200 i object z pola message i visits jako liczba', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Test message');
    expect(typeof res.body.visits).toBe('number');
  }, 10000);
});
