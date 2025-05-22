const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/auth', require('../routes/auth'));
const { User } = require('../models');

beforeAll(async () => {
  await User.destroy({ where: {} });
});

describe('Auth Endpoints', () => {
  it('should register a new consumer', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'password', role: 'consumer' });
    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe('testuser@example.com');
  });

  it('should not register with existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'testuser@example.com', password: 'password', role: 'consumer' });
    expect(res.statusCode).toBe(409);
  });

  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'password' });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'wrongpass' });
    expect(res.statusCode).toBe(401);
  });
});
