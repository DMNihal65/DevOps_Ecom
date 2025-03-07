const db = require('../config/database');
const logger = require('../config/logger');
const seedProducts = require('../seeds/products');

const setupDb = async () => {
  try {
    // Check database connection
    await db.query('SELECT NOW()');
    logger.info('Database connected successfully');

    // Run seeds if in development
    if (process.env.NODE_ENV === 'development') {
      await seedProducts();
      logger.info('Database seeded successfully');
    }
  } catch (err) {
    logger.error('Database setup error:', err);
    process.exit(1);
  }
};

module.exports = setupDb; 