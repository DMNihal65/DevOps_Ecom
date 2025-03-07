const db = require('../config/database');

const products = [
  {
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 99.99,
    stock: 50,
    image_url: 'https://via.placeholder.com/300x200?text=Headphones'
  },
  {
    name: 'Smartphone',
    description: 'Latest model with high-resolution camera and fast processor',
    price: 699.99,
    stock: 30,
    image_url: 'https://via.placeholder.com/300x200?text=Smartphone'
  },
  {
    name: 'Laptop',
    description: 'Powerful laptop for work and gaming with long battery life',
    price: 1299.99,
    stock: 20,
    image_url: 'https://via.placeholder.com/300x200?text=Laptop'
  }
];

const seedProducts = async () => {
  try {
    for (const product of products) {
      await db.query(
        `INSERT INTO products (name, description, price, stock, image_url)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (name) DO NOTHING`,
        [product.name, product.description, product.price, product.stock, product.image_url]
      );
    }
    console.log('Products seeded successfully');
  } catch (err) {
    console.error('Error seeding products:', err);
  }
};

module.exports = seedProducts; 