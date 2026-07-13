const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const meetingController = require('../controllers/meetingController');
const { protect, adminProtect } = require('../middleware/auth');

// Public/Authenticated Create Booking Route
router.post('/create', [
    // Parse JWT optionally if header is supplied (handled inside controller)
    body('fullName').notEmpty().withMessage('Full name is required').trim(),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').notEmpty().withMessage('Contact number is required').trim(),
    body('company').notEmpty().withMessage('Company name is required').trim(),
    body('service').isIn(['events', 'gifting', 'branding', 'recruitment']).withMessage('Invalid corporate service selected'),
    body('purpose').notEmpty().withMessage('Session purpose details are required').trim(),
    body('date').isISO8601().toDate().withMessage('Valid preferred date is required'),
    body('time').notEmpty().withMessage('Preferred time slot selection is required')
], meetingController.createMeeting);

// Fetch logged-in user's meeting history
router.get('/user', protect, meetingController.getUserMeetings);

// Admin console fetch
router.get('/admin', adminProtect, meetingController.getAdminMeetings);

// Admin actions
router.put('/approve', [
    adminProtect,
    body('meetingId').isMongoId().withMessage('Invalid meeting ID format'),
    body('link').isURL().withMessage('Valid conference join link is required')
], meetingController.approveMeeting);

router.put('/reject', [
    adminProtect,
    body('meetingId').isMongoId().withMessage('Invalid meeting ID format'),
    body('reason').notEmpty().withMessage('Rejection reason must be provided')
], meetingController.rejectMeeting);

router.put('/reschedule', [
    adminProtect,
    body('meetingId').isMongoId().withMessage('Invalid meeting ID format'),
    body('date').isISO8601().toDate().withMessage('Valid reschedule date is required'),
    body('time').notEmpty().withMessage('Reschedule time slot selection is required'),
    body('link').isURL().withMessage('Valid conference join link is required')
], meetingController.rescheduleMeeting);

router.delete('/delete', [
    adminProtect,
    body('meetingId').isMongoId().withMessage('Invalid meeting ID format')
], meetingController.deleteMeeting);

module.exports = router;
