const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { adminProtect } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

// Submit brand contact inquiry (rate limited)
router.post('/', [
    apiLimiter,
    body('name').notEmpty().withMessage('Name is required').trim(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').notEmpty().withMessage('Phone number is required').trim(),
    body('subject').notEmpty().withMessage('Subject line is required').trim(),
    body('message').notEmpty().withMessage('Message text is required').trim()
], contactController.submitContactForm);

// Retrieve contact submissions list (Admin console)
router.get('/admin', adminProtect, contactController.getAdminContacts);

module.exports = router;
