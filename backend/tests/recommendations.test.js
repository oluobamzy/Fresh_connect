const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/recommendations', require('../routes/recommendations'));

describe('Recommendations Endpoint', () => {
  it('should not allow unauthenticated access', async () => {
    const res = await request(app).get('/api/recommendations');
    expect(res.statusCode).toBe(401);
  });
});
