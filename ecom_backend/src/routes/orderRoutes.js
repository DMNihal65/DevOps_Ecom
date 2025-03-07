const express = require('express');
const router = express.Router();
const db = require('../utils/inMemoryDb');

// Get all orders
router.get('/', (req, res) => {
  res.json(db.orders);
});

// Get order by ID
router.get('/:id', (req, res) => {
  const order = db.orders.find(o => o.id === parseInt(req.params.id));
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json(order);
});

// Create new order
router.post('/', (req, res) => {
  const { userId, products } = req.body;

  // Basic validation
  if (!userId || !products || !products.length) {
    return res.status(400).json({ message: 'Please provide userId and products' });
  }

  // Check if user exists
  const user = db.users.find(u => u.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Calculate total
  const total = products.reduce((sum, item) => {
    const product = db.products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const order = {
    id: db.orders.length + 1,
    userId,
    products,
    total,
    status: 'pending',
    createdAt: new Date()
  };

  db.orders.push(order);
  res.status(201).json(order);
});

module.exports = router; 