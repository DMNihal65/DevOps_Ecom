const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Products route
app.get('/api/products', (req, res) => {
  // For now, return mock data
  const products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://via.placeholder.com/300x200?text=Headphones',
      description: 'High-quality wireless headphones with noise cancellation.'
    },
    // ... other products
  ];
  
  res.json(products);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 