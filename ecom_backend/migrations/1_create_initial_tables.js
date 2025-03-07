exports.up = (pgm) => {
  // Users table
  pgm.createTable('users', {
    id: 'id',
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'varchar(255)', notNull: true },
    name: { type: 'varchar(255)', notNull: true },
    role: { 
      type: 'varchar(20)', 
      notNull: true, 
      default: 'customer' 
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Products table
  pgm.createTable('products', {
    id: 'id',
    name: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    price: { 
      type: 'numeric(10,2)', 
      notNull: true 
    },
    stock: { 
      type: 'integer', 
      notNull: true, 
      default: 0 
    },
    image_url: { type: 'varchar(255)' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Orders table
  pgm.createTable('orders', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    status: {
      type: 'varchar(20)',
      notNull: true,
      default: 'pending',
    },
    total: {
      type: 'numeric(10,2)',
      notNull: true,
    },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Order items table
  pgm.createTable('order_items', {
    id: 'id',
    order_id: {
      type: 'integer',
      notNull: true,
      references: '"orders"',
      onDelete: 'CASCADE',
    },
    product_id: {
      type: 'integer',
      notNull: true,
      references: '"products"',
      onDelete: 'RESTRICT',
    },
    quantity: {
      type: 'integer',
      notNull: true,
    },
    price: {
      type: 'numeric(10,2)',
      notNull: true,
    },
  });

  // Indexes
  pgm.createIndex('users', 'email');
  pgm.createIndex('orders', 'user_id');
  pgm.createIndex('order_items', ['order_id', 'product_id']);
};

exports.down = (pgm) => {
  pgm.dropTable('order_items');
  pgm.dropTable('orders');
  pgm.dropTable('products');
  pgm.dropTable('users');
}; 