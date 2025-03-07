const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new ErrorResponse('Validation Error', 400);
    error.errors = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));
    return next(error);
  }
  next();
};

module.exports = validate; 