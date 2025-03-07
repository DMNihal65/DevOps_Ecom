const express = require('express');
const { body } = require('express-validator');
const { 
  getOrders,
  getMyOrders,
  getOrder,
  createOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Order validation rules
const orderValidation = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),
  body('items.*.product_id')
    .isInt({ min: 1 })
    .withMessage('Invalid product ID'),
  body('items.*.quantity')
    .isInt({ min: 1 })
    .withMessage('Quantity must be at least 1')
];

const statusValidation = [
  body('status')
    .isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled'])
    .withMessage('Invalid status')
];

// Apply protect middleware to all routes
router.use(protect);

router
  .route('/')
  .get(authorize('admin'), getOrders)
  .post(orderValidation, validate, createOrder);

router.get('/my-orders', getMyOrders);

router
  .route('/:id')
  .get(getOrder)
  .put(authorize('admin'), statusValidation, validate, updateOrderStatus);

module.exports = router; 