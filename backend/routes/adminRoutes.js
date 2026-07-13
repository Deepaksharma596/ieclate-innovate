const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminProtect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');

// Admin Login step 1: credentials & registered mobile check
router.post('/login', [
    authLimiter,
    body('email').isEmail().withMessage('Valid admin email is required').normalizeEmail(),
    body('password').notEmpty().withMessage('Admin password is required'),
    body('mobileNumber').notEmpty().withMessage('Registered mobile number is required')
], adminController.login);

// Admin Login step 2: SMS code check
router.post('/verify-mobile-otp', [
    body('mobileNumber').notEmpty().withMessage('Registered mobile number is required'),
    body('code').isLength({ min: 6, max: 6 }).withMessage('Verification code must be exactly 6 digits')
], adminController.verifyMobileOtp);

// Admin dashboard statistics endpoint
router.get('/dashboard', adminProtect, adminController.getDashboardStats);

module.exports = router;
