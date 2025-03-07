const express = require('express');
const { body } = require('express-validator');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

// Product validation rules
const productValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive integer'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('image_url')
    .optional()
    .isURL()
    .withMessage('Invalid image URL')
];

router
  .route('/')
  .get(getProducts)
  .post(protect, authorize('admin'), productValidation, validate, createProduct);

router
  .route('/:id')
  .get(getProduct)
  .put(protect, authorize('admin'), productValidation, validate, updateProduct)
  .delete(protect, authorize('admin'), deleteProduct);

module.exports = router; 