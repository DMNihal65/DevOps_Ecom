const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../config/logger');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return next(new ErrorResponse('Email already registered', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  const token = generateToken(user.id);
  logger.info(`New user registered: ${email}`);

  res.status(201).json({
    success: true,
    data: {
      user,
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findByEmail(email);
  if (!user) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorResponse('Invalid credentials', 401));
  }

  const token = generateToken(user.id);
  logger.info(`User logged in: ${email}`);

  // Remove password from response
  delete user.password;

  res.json({
    success: true,
    data: {
      user,
      token
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.json({
    success: true,
    data: user
  });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.update(req.user.id, updates);
  if (!user) {
    return next(new ErrorResponse('User not found', 404));
  }

  res.json({
    success: true,
    data: user
  });
});

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findByEmail(req.user.email);

  // Check current password
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  // Update password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await User.update(req.user.id, { password: hashedPassword });

  res.json({
    success: true,
    message: 'Password updated successfully'
  });
}); 