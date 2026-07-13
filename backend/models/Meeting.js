const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true
    },
    service: {
        type: String,
        required: [true, 'Service selection is required'],
        enum: ['events', 'gifting', 'branding', 'recruitment']
    },
    purpose: {
        type: String,
        required: [true, 'Meeting purpose is required'],
        trim: true
    },
    date: {
        type: Date,
        required: [true, 'Meeting date is required']
    },
    time: {
        type: String,
        required: [true, 'Meeting time slot is required']
    },
    notes: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
        enum: ['Pending', 'Approved', 'Rejected', 'Completed']
    },
    link: {
        type: String,
        trim: true
    },
    rejectReason: {
        type: String,
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Meeting', MeetingSchema);
