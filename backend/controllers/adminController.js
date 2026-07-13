const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const OTP = require('../models/OTP');
const Meeting = require('../models/Meeting');
const smsService = require('../services/smsService');

// Helper: Generate JWT signed token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

/**
 * @desc    Admin authentication Step 1: Verify credentials and send SMS OTP
 * @route   POST /api/admin/login
 */
exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, mobileNumber } = req.body;

    let normalizedMobile = mobileNumber.trim();
    if (!normalizedMobile.startsWith('+')) {
        if (normalizedMobile.length === 10) {
            normalizedMobile = '+91' + normalizedMobile;
        } else {
            normalizedMobile = '+' + normalizedMobile;
        }
    }

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin Not Found' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Wrong Password' });
        }

        // Compare registered mobile number strictly
        if (admin.mobileNumber !== normalizedMobile) {
            return res.status(400).json({ success: false, message: 'Wrong Mobile Number' });
        }

        // Clean existing OTP records
        await OTP.deleteMany({ phone: normalizedMobile, type: 'admin-mfa' });

        // Generate 6-digit MFA OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await OTP.create({
            phone: normalizedMobile,
            code: otpCode,
            type: 'admin-mfa',
            expiresAt
        });

        // Send SMS OTP code
        const messageBody = `[IECLATE INOVATE] Admin Login Verification. Your 6-digit OTP code is: ${otpCode}`;
        await smsService.sendSMS(normalizedMobile, messageBody);

        res.status(200).json({
            success: true,
            message: 'MFA OTP sent successfully to registered mobile number',
            otpCode: process.env.NODE_ENV === 'development' ? otpCode : undefined // Expose code only in dev mode for easy sandbox testing
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Admin verification Step 2: Validate mobile OTP and generate JWT
 * @route   POST /api/admin/verify-mobile-otp
 */
exports.verifyMobileOtp = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { mobileNumber, code } = req.body;

    let normalizedMobile = mobileNumber.trim();
    if (!normalizedMobile.startsWith('+')) {
        if (normalizedMobile.length === 10) {
            normalizedMobile = '+91' + normalizedMobile;
        } else {
            normalizedMobile = '+' + normalizedMobile;
        }
    }

    try {
        const otpRecord = await OTP.findOne({ phone: normalizedMobile, code, type: 'admin-mfa' });
        if (!otpRecord) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP verification code' });
        }

        const admin = await Admin.findOne({ mobileNumber: normalizedMobile });
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin account record not found' });
        }

        // Clean up OTP record
        await OTP.deleteOne({ _id: otpRecord._id });

        // Generate JWT
        const token = generateToken(admin._id);

        res.status(200).json({
            success: true,
            message: 'MFA verification successful',
            token,
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Fetch Admin Dashboard metrics and list requests
 * @route   GET /api/admin/dashboard
 */
exports.getDashboardStats = async (req, res, next) => {
    try {
        // Run aggregate counts
        const totalCount = await Meeting.countDocuments();
        const pendingCount = await Meeting.countDocuments({ status: 'Pending' });
        const approvedCount = await Meeting.countDocuments({ status: 'Approved' });
        const rejectedCount = await Meeting.countDocuments({ status: 'Rejected' });
        const completedCount = await Meeting.countDocuments({ status: 'Completed' });

        // Fetch recent meetings list
        const meetingsList = await Meeting.find().sort({ createdAt: -1 }).limit(10);

        res.status(200).json({
            success: true,
            metrics: {
                total: totalCount,
                pending: pendingCount,
                approved: approvedCount,
                rejected: rejectedCount,
                completed: completedCount
            },
            meetings: meetingsList
        });
    } catch (error) {
        next(error);
    }
};
