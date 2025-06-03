const axios = require('axios');

describe('Integration Test: GET / via Docker Compose (Mongo+Redis)', () => {
  it('powinno zwrócić 200 i JSON z polami message (string) oraz visits (number)', async () => {
    const response = await axios.get('http://localhost:3000/');
    expect(response.status).toBe(200);
    expect(typeof response.data).toBe('object');
    expect(typeof response.data.message).toBe('string');
    expect(typeof response.data.visits).toBe('number');
  });
});
