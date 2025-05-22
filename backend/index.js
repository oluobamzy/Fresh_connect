// Project entry point
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 })); // 100 requests per 15 minutes per IP

// Health check route
const healthRouter = require('./routes/health');
app.use('/api/health', healthRouter);

// Auth route
const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

// Users route
const usersRouter = require('./routes/users');
app.use('/api/users', usersRouter);

// Products route
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// Orders route
const ordersRouter = require('./routes/orders');
app.use('/api/orders', ordersRouter);

// Payments route
const paymentsRouter = require('./routes/payments');
app.use('/api/payments', paymentsRouter);

// Forum route
const forumRouter = require('./routes/forum');
app.use('/api/forum', forumRouter);

// Recipes route
const recipesRouter = require('./routes/recipes');
app.use('/api/recipes', recipesRouter);

// Disputes route
const disputesRouter = require('./routes/disputes');
app.use('/api/disputes', disputesRouter);

// Analytics route
const analyticsRouter = require('./routes/analytics');
app.use('/api/analytics', analyticsRouter);

// Recommendations route
const recommendationsRouter = require('./routes/recommendations');
app.use('/api/recommendations', recommendationsRouter);

// Chatbot route
const chatbotRouter = require('./routes/chatbot');
app.use('/api/chatbot', chatbotRouter);

app.get('/api', (req, res) => {
  res.send('API is running...');
}
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
