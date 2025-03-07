const express = require('express');
const router = express.Router();

// Product routes
router.get('/', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://via.placeholder.com/300x200?text=Headphones',
      description: 'High-quality wireless headphones with noise cancellation.'
    },
    {
      id: 2,
      name: 'Smartphone',
      price: 699.99,
      image: 'https://via.placeholder.com/300x200?text=Smartphone',
      description: 'Latest model with high-resolution camera and fast processor.'
    },
    {
      id: 3,
      name: 'Laptop',
      price: 1299.99,
      image: 'https://via.placeholder.com/300x200?text=Laptop',
      description: 'Powerful laptop for work and gaming with long battery life.'
    }
  ]);
});

router.post('/', (req, res) => {
  // TODO: Add product creation logic
  res.status(201).json({ message: 'Product created' });
});

module.exports = router; 