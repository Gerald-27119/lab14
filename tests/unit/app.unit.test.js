// tests/unit/app.unit.test.js
const request = require('supertest');
const app = require('../../app');

describe('Unit Test: GET /', () => {
  it('powinno zwrócić 200 i object z pola message i visits jako liczba', async () => {
    // W trybie testowym (NODE_ENV=test) nasza aplikacja nie
    // próbuje łączyć się z prawdziwym Mongo/Redis, tylko zwraca
    // { message: 'Test message', visits: 1 }.
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Test message');
    expect(typeof res.body.visits).toBe('number');
  }, // opcjonalnie: można zwiększyć timeout, ale poniżej
  // test i tak działa szybko, bo nie ma rzeczywistego połączenia
  10000);
});
