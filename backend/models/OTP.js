const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'OTP code is required']
    },
    type: {
        type: String,
        required: true,
        enum: ['register', 'forgot-password', 'admin-mfa']
    },
    expiresAt: {
        type: Date,
        required: true
    },
    // Optional temporary registration details
    fullName: {
        type: String,
        trim: true
    },
    password: {
        type: String
    }
}, {
    timestamps: true
});

// TTL Index: Automatically remove expired documents at the expiresAt date
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTP', OTPSchema);
