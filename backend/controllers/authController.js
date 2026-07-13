const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const OTP = require('../models/OTP');
const emailService = require('../services/emailService');

// Helper: Generate JWT signed token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

/**
 * @desc    Register a new user (Verification required)
 * @route   POST /api/auth/register
 */
exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { fullName, email, password } = req.body;

    try {
        // Prevent duplicate registration of already verified users
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists with this email address' });
        }

        // Clean existing OTP records of registration type for this email
        await OTP.deleteMany({ email, type: 'register' });

        // Generate 4-digit verification code
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

        // Save OTP along with temporary registration details
        await OTP.create({
            email,
            code: otpCode,
            type: 'register',
            expiresAt,
            fullName,
            password // Saved plain; will be securely hashed by User Schema hook on verification save
        });

        // Log OTP to server console for local developer debugging/testing
        console.log(`[Register OTP] Code: ${otpCode} generated for ${email}`);

        // Send OTP code via email
        await emailService.sendOtpEmail(email, otpCode, 'register');

        res.status(201).json({
            success: true,
            message: 'Registration initiated. Please verify your email using the verification code.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Verify email address using OTP
 * @route   POST /api/auth/verify-email
 */
exports.verifyEmail = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, code } = req.body;

    try {
        const otpRecord = await OTP.findOne({ email, code, type: 'register' });
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        // Create user record now that verification succeeded
        const user = new User({
            fullName: otpRecord.fullName,
            email: otpRecord.email,
            password: otpRecord.password,
            isVerified: true
        });
        await user.save();

        // Clean up OTP record
        await OTP.deleteOne({ _id: otpRecord._id });

        // Send Welcome email
        await emailService.sendWelcomeEmail(email, user.fullName);

        // Generate JWT
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Email verified successfully. Welcome onboard!',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    User Login validation
 * @route   POST /api/auth/login
 */
exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Enforce email verification status
        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: 'Please verify your email address before logging in' });
        }

        // Compare password input
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Store login time
        user.loginTime = new Date();
        await user.save();

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Forgot Password OTP Request
 * @route   POST /api/auth/forgot-password
 */
exports.forgotPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'No account found with this email address' });
        }

        // Clean existing OTPs
        await OTP.deleteMany({ email, type: 'forgot-password' });

        // Generate verification code
        const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.create({
            email,
            code: otpCode,
            type: 'forgot-password',
            expiresAt
        });

        await emailService.sendOtpEmail(email, otpCode, 'forgot-password');

        res.status(200).json({
            success: true,
            message: 'Reset verification code dispatched to your email address.'
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reset Password after verifying code
 * @route   POST /api/auth/reset-password
 */
exports.resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, code, newPassword } = req.body;

    try {
        const otpRecord = await OTP.findOne({ email, code, type: 'forgot-password' });
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User record not found' });
        }

        // Set new password (auto-hashed in pre-save)
        user.password = newPassword;
        await user.save();

        // Clean up OTP record
        await OTP.deleteOne({ _id: otpRecord._id });

        res.status(200).json({
            success: true,
            message: 'Password reset completed successfully. Please log in.'
        });
    } catch (error) {
        next(error);
    }
};
