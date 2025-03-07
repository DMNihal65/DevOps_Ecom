const db = require('../config/database');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getOrders = asyncHandler(async (req, res) => {
  const { rows } = await db.query(`
    SELECT 
      o.*,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `);

  res.json({
    success: true,
    count: rows.length,
    data: rows
  });
});

// @desc    Get user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const { rows } = await db.query(`
    SELECT 
      o.*,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `, [req.user.id]);

  res.json({
    success: true,
    count: rows.length,
    data: rows
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = asyncHandler(async (req, res, next) => {
  const { rows } = await db.query(`
    SELECT 
      o.*,
      json_agg(
        json_build_object(
          'id', oi.id,
          'product_id', oi.product_id,
          'quantity', oi.quantity,
          'price', oi.price,
          'product_name', p.name
        )
      ) as items
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.id = $1
    GROUP BY o.id
  `, [req.params.id]);

  if (!rows[0]) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  // Check if user is admin or order belongs to user
  if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this order', 403));
  }

  res.json({
    success: true,
    data: rows[0]
  });
});

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { items } = req.body;

  if (!items || !items.length) {
    return next(new ErrorResponse('Please add items to your order', 400));
  }

  // Start transaction
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // Calculate total and check stock
    let total = 0;
    for (const item of items) {
      const { rows } = await client.query(
        'SELECT price, stock FROM products WHERE id = $1',
        [item.product_id]
      );

      if (!rows[0]) {
        throw new ErrorResponse(`Product not found with id of ${item.product_id}`, 404);
      }

      if (rows[0].stock < item.quantity) {
        throw new ErrorResponse(
          `Insufficient stock for product with id ${item.product_id}`,
          400
        );
      }

      total += rows[0].price * item.quantity;

      // Update stock
      await client.query(
        'UPDATE products SET stock = stock - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Create order
    const { rows: [order] } = await client.query(
      `INSERT INTO orders (user_id, total, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [req.user.id, total]
    );

    // Create order items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, (SELECT price FROM products WHERE id = $2))`,
        [order.id, item.product_id, item.quantity]
      );
    }

    await client.query('COMMIT');

    logger.info(`Order created: ${order.id} by user ${req.user.id}`);

    // Get complete order with items
    const { rows: [completeOrder] } = await db.query(`
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'product_id', oi.product_id,
            'quantity', oi.quantity,
            'price', oi.price,
            'product_name', p.name
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = $1
      GROUP BY o.id
    `, [order.id]);

    res.status(201).json({
      success: true,
      data: completeOrder
    });

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id
// @access  Private/Admin
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!['pending', 'processing', 'shipped', 'delivered', 'cancelled'].includes(status)) {
    return next(new ErrorResponse('Invalid status', 400));
  }

  const { rows } = await db.query(
    `UPDATE orders
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [status, req.params.id]
  );

  if (!rows[0]) {
    return next(new ErrorResponse(`Order not found with id of ${req.params.id}`, 404));
  }

  logger.info(`Order ${req.params.id} status updated to ${status}`);

  res.json({
    success: true,
    data: rows[0]
  });
}); 