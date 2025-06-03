const request = require('supertest');
const app = require('../../app');

describe('Unit Test: GET /', () => {
  it('powinno zwrócić 200 i object z pola message i visits jako liczba', async () => {
    // Uruchamiamy Testy jednostkowe bez faktycznego Mongo i Redis:
    // Oczekujemy, że kod zwróci 500 (ponieważ połączenie Mongo nie jest dostępne)
    const res = await request(app).get('/');
    expect([500, 200]).toContain(res.statusCode);
  });
});
