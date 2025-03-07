const db = require('../config/database');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
  const { rows } = await db.query(
    'SELECT * FROM products ORDER BY created_at DESC'
  );

  res.json({
    success: true,
    count: rows.length,
    data: rows
  });
});

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { rows } = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [req.params.id]
  );

  if (!rows[0]) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  res.json({
    success: true,
    data: rows[0]
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock, image_url } = req.body;

  const { rows } = await db.query(
    `INSERT INTO products (name, description, price, stock, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, description, price, stock, image_url]
  );

  logger.info(`Product created: ${name}`);

  res.status(201).json({
    success: true,
    data: rows[0]
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const { name, description, price, stock, image_url } = req.body;

  // Check if product exists
  let { rows } = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [req.params.id]
  );

  if (!rows[0]) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Update product
  const result = await db.query(
    `UPDATE products
     SET name = $1, description = $2, price = $3, stock = $4, image_url = $5, updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [name, description, price, stock, image_url, req.params.id]
  );

  logger.info(`Product updated: ${name}`);

  res.json({
    success: true,
    data: result.rows[0]
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  // Check if product exists
  const { rows } = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [req.params.id]
  );

  if (!rows[0]) {
    return next(new ErrorResponse(`Product not found with id of ${req.params.id}`, 404));
  }

  // Delete product
  await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);

  logger.info(`Product deleted: ${rows[0].name}`);

  res.json({
    success: true,
    data: {}
  });
}); 