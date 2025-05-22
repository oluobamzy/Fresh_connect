const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/forum', require('../routes/forum'));
const { ForumPost } = require('../models');
const sequelize = require('../config/database');

describe('Forum Endpoints', () => {
  beforeAll(async () => {
    await sequelize.sync();
    await ForumPost.destroy({ where: {} });
  });

  it('should get all forum posts (empty)', async () => {
    const res = await request(app).get('/api/forum/posts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
