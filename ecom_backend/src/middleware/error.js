const ErrorResponse = require('../utils/errorResponse');
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  logger.error(err.stack);

  // Postgres errors
  if (err.code === '23503') { // foreign key violation
    error = new ErrorResponse('Referenced resource not found', 404);
  }
  
  if (err.code === '23505') { // unique violation
    error = new ErrorResponse('Duplicate field value entered', 400);
  }

  if (err.code === '23514') { // check violation
    error = new ErrorResponse('Invalid data provided', 400);
  }

  // Transaction errors
  if (err.message.includes('insufficient stock')) {
    error = new ErrorResponse(err.message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler; 