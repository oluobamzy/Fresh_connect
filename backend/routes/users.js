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

// Get public farmer profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { 
      attributes: ['id', 'name', 'email', 'role', 'farmDetails', 'isVerified', 'createdAt'] 
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Only return farmer profiles or limit data for other roles
    if (user.role !== 'farmer') {
      return res.json({
        id: user.id,
        name: user.name,
        role: user.role,
      });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
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
