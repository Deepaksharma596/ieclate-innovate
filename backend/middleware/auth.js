const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

/**
 * Protect route: Verifies the User's JWT token
 */
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User account not found' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, token invalid' });
    }
};

/**
 * Admin protect route: Verifies Admin credentials and JWT token
 */
exports.adminProtect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, administrator session missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id).select('-password');
        if (!req.admin) {
            return res.status(401).json({ success: false, message: 'Administrator account not found' });
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized, administrator token invalid' });
    }
};
