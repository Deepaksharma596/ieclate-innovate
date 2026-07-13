const { validationResult } = require('express-validator');
const Meeting = require('../models/Meeting');
const User = require('../models/User');
const emailService = require('../services/emailService');

/**
 * @desc    Submit a new meeting booking
 * @route   POST /api/meetings/create
 */
exports.createMeeting = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { fullName, email, phone, company, service, purpose, date, time, notes } = req.body;

    try {
        const parsedDate = new Date(date);

        // Prevent duplicate meeting bookings for the same client, date and time
        const duplicateMeeting = await Meeting.findOne({
            email,
            date: parsedDate,
            time,
            status: { $ne: 'Rejected' }
        });

        if (duplicateMeeting) {
            return res.status(400).json({
                success: false,
                message: 'You have already requested a meeting slot for this preferred date and time.'
            });
        }

        // Initialize meeting object
        const meetingData = {
            fullName,
            email,
            phone,
            company,
            service,
            purpose,
            date: parsedDate,
            time,
            notes,
            status: 'Pending'
        };

        // If user is authenticated, attach user reference
        if (req.user) {
            meetingData.user = req.user._id;
        } else {
            // Check if user account exists with this email to link them
            const registeredUser = await User.findOne({ email });
            if (registeredUser) {
                meetingData.user = registeredUser._id;
            }
        }

        const meeting = await Meeting.create(meetingData);

        // Send confirmation email
        await emailService.sendMeetingRequestEmail(email, fullName, meeting);

        res.status(201).json({
            success: true,
            message: 'Meeting booking request submitted successfully. Administrator verification pending.',
            meeting
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Retrieve meetings booked by currently authenticated user
 * @route   GET /api/meetings/user
 */
exports.getUserMeetings = async (req, res, next) => {
    try {
        // Query by user ID
        const meetings = await Meeting.find({ user: req.user._id }).sort({ date: 1 });
        
        res.status(200).json({
            success: true,
            meetings
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Retrieve all meetings with search & filtering (Admin console)
 * @route   GET /api/meetings/admin
 */
exports.getAdminMeetings = async (req, res, next) => {
    try {
        const { search, status, service } = req.query;
        let query = {};

        // Filter by Status
        if (status) {
            query.status = status;
        }

        // Filter by Service Area
        if (service) {
            query.service = service;
        }

        // Search in Name, Company, or Email
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const meetings = await Meeting.find(query).sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: meetings.length,
            meetings
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Approve meeting booking with links
 * @route   PUT /api/meetings/approve
 */
exports.approveMeeting = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { meetingId, date, time, link } = req.body;

    try {
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting booking not found' });
        }

        // Update booking details
        meeting.status = 'Approved';
        if (date) meeting.date = new Date(date);
        if (time) meeting.time = time;
        meeting.link = link;
        meeting.rejectReason = undefined; // Reset reject reason on approval

        await meeting.save();

        // Dispatch confirmation email
        await emailService.sendMeetingApprovedEmail(meeting.email, meeting.fullName, meeting);

        res.status(200).json({
            success: true,
            message: 'Meeting approved successfully. Confirmation email dispatched.',
            meeting
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reject meeting booking
 * @route   PUT /api/meetings/reject
 */
exports.rejectMeeting = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { meetingId, reason } = req.body;

    try {
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting booking not found' });
        }

        meeting.status = 'Rejected';
        meeting.rejectReason = reason;
        meeting.link = undefined; // Clear any existing virtual link

        await meeting.save();

        // Dispatch email notification
        await emailService.sendMeetingRejectedEmail(meeting.email, meeting.fullName, reason);

        res.status(200).json({
            success: true,
            message: 'Meeting request rejected. Email notification sent.',
            meeting
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Reschedule an existing meeting booking
 * @route   PUT /api/meetings/reschedule
 */
exports.rescheduleMeeting = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { meetingId, date, time, link } = req.body;

    try {
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting booking not found' });
        }

        // Update credentials
        meeting.date = new Date(date);
        meeting.time = time;
        if (link) meeting.link = link;
        meeting.status = 'Approved'; // Reset to approved on reschedule

        await meeting.save();

        // Dispatch rescheduled confirmation email
        await emailService.sendMeetingRescheduledEmail(meeting.email, meeting.fullName, meeting);

        res.status(200).json({
            success: true,
            message: 'Meeting rescheduled successfully. Updated email notification sent.',
            meeting
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete meeting booking
 * @route   DELETE /api/meetings/delete
 */
exports.deleteMeeting = async (req, res, next) => {
    const { meetingId } = req.body;

    try {
        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ success: false, message: 'Meeting booking not found' });
        }

        await Meeting.deleteOne({ _id: meetingId });

        res.status(200).json({
            success: true,
            message: 'Meeting booking deleted successfully.'
        });
    } catch (error) {
        next(error);
    }
};
