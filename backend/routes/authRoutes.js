const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const authController = require('../controllers/authController');
const { authLimiter } = require('../middleware/rateLimiter');

// Registration route
router.post('/register', [
    authLimiter,
    body('fullName').notEmpty().withMessage('Full name is required').trim(),
    body('email').isEmail().withMessage('Please include a valid email address').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
], authController.register);

// Verification code check
router.post('/verify-email', [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('code').isLength({ min: 4, max: 4 }).withMessage('Verification code must be exactly 4 digits')
], authController.verifyEmail);

// Login route
router.post('/login', [
    authLimiter,
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
], authController.login);

// Forgot password dispatch
router.post('/forgot-password', [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail()
], authController.forgotPassword);

// Reset password request
router.post('/reset-password', [
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('code').isLength({ min: 4, max: 4 }).withMessage('Verification code must be exactly 4 digits'),
    body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters long')
], authController.resetPassword);

module.exports = router;
