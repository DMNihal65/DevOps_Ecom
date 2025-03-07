const express = require('express');
const router = express.Router();
const db = require('../utils/inMemoryDb');

// Get all users
router.get('/', (req, res) => {
  res.json(db.users);
});

// Get user by ID
router.get('/:id', (req, res) => {
  const user = db.users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

// Create new user
router.post('/', (req, res) => {
  const { email, name, password } = req.body;
  
  // Basic validation
  if (!email || !name || !password) {
    return res.status(400).json({ message: 'Please provide email, name and password' });
  }

  // Check if user already exists
  if (db.users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = {
    id: db.users.length + 1,
    email,
    name,
    password, // In a real app, this should be hashed
    createdAt: new Date()
  };

  db.users.push(user);
  res.status(201).json(user);
});

module.exports = router; 