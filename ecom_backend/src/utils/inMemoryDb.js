// Simple in-memory storage
const db = {
  products: [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://via.placeholder.com/300x200?text=Headphones',
      description: 'High-quality wireless headphones with noise cancellation.'
    },
    // ... existing products
  ],
  users: [],
  orders: []
};

module.exports = db; 