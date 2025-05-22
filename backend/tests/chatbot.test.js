const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/chatbot', require('../routes/chatbot'));

describe('Chatbot Endpoint', () => {
  it('should not allow unauthenticated access', async () => {
    const res = await request(app).post('/api/chatbot/query').send({ message: 'order' });
    expect(res.statusCode).toBe(401);
  });
});
