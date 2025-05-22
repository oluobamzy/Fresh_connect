const express = require('express');
const { Product, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();

// Get all products (with optional filters)
router.get('/', async (req, res) => {
  const { category, location, available } = req.query;
  const where = {};
  if (category) where.category = category;
  if (location) where.location = location;
  if (available) where.quantityAvailable = { $gt: 0 };
  const products = await Product.findAll({ where });
  res.json(products);
});

// Get product by id
router.get('/:id', async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Farmer: create product
router.post('/', authenticate, requireRole('farmer'), async (req, res) => {
  const { name, description, category, price, quantityAvailable, location, images } = req.body;
  const product = await Product.create({
    name,
    description,
    category,
    price,
    quantityAvailable,
    location,
    images,
    farmerId: req.user.id,
  });
  res.status(201).json(product);
});

// Farmer: update product
router.patch('/:id', authenticate, requireRole('farmer'), async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product || product.farmerId !== req.user.id) return res.status(404).json({ error: 'Product not found or not yours' });
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

// Farmer: delete product
router.delete('/:id', authenticate, requireRole('farmer'), async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product || product.farmerId !== req.user.id) return res.status(404).json({ error: 'Product not found or not yours' });
  await product.destroy();
  res.json({ message: 'Product deleted' });
});

module.exports = router;
