const rateLimit = require('express-rate-limit');

/**
 * Global API rate limiter - 100 requests per 15 minutes
 */
exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

/**
 * Strict authentication rate limiter - 10 requests per 15 minutes (for login/OTP/register)
 */
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: 'Too many login or verification attempts. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
