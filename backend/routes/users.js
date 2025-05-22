const express = require('express');
const { User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get current user profile
router.get('/me', authenticate, async (req, res) => {
  const user = await User.findByPk(req.user.id, { attributes: { exclude: ['passwordHash'] } });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Update current user profile
router.patch('/me', authenticate, async (req, res) => {
  const user = await User.findByPk(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  Object.assign(user, req.body);
  await user.save();
  res.json({ message: 'Profile updated', user });
});

// Admin: get all users
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  const users = await User.findAll({ attributes: { exclude: ['passwordHash'] } });
  res.json(users);
});

// Admin: update user
router.patch('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  Object.assign(user, req.body);
  await user.save();
  res.json({ message: 'User updated', user });
});

// Admin: delete user
router.delete('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  await user.destroy();
  res.json({ message: 'User deleted' });
});

module.exports = router;
