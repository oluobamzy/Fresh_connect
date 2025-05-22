const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Dummy personalized recommendations endpoint
router.get('/', authenticate, async (req, res) => {
  // In a real app, use purchase history and preferences
  res.json({ recommendations: ['Fresh apples', 'Organic carrots', 'Local honey'] });
});

module.exports = router;
