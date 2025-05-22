const express = require('express');
const { ForumPost, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get all forum posts
router.get('/posts', async (req, res) => {
  const posts = await ForumPost.findAll();
  res.json(posts);
});

// Create a new forum post
router.post('/posts', authenticate, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
  const post = await ForumPost.create({
    userId: req.user.id,
    title,
    content,
    replies: [],
    isModerated: false,
  });
  res.status(201).json(post);
});

// Get a single forum post by id
router.get('/posts/:id', async (req, res) => {
  const post = await ForumPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// Reply to a forum post
router.post('/posts/:id/reply', authenticate, async (req, res) => {
  const post = await ForumPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const { content } = req.body;
  if (!content) return res.status(400).json({ error: 'Reply content required' });
  const replies = post.replies || [];
  replies.push({ userId: req.user.id, content, createdAt: new Date() });
  post.replies = replies;
  await post.save();
  res.json(post);
});

// Moderator: update (moderate) a forum post
router.patch('/posts/:id', authenticate, requireRole('admin'), async (req, res) => {
  const post = await ForumPost.findByPk(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

module.exports = router;
