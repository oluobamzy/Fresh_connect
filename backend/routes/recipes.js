const express = require('express');
const { RecipeSuggestion } = require('../models');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Get recipe suggestions for a user (dummy logic)
router.get('/suggestions', authenticate, async (req, res) => {
  // In a real app, use purchase history and AI/ML for suggestions
  const suggestions = await RecipeSuggestion.findAll({ where: { userId: req.user.id } });
  res.json(suggestions);
});

module.exports = router;
