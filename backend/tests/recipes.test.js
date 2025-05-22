const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/recipes', require('../routes/recipes'));

describe('Recipes Endpoint', () => {
  it('should not allow unauthenticated access', async () => {
    const res = await request(app).get('/api/recipes/suggestions');
    expect(res.statusCode).toBe(401);
  });
});
