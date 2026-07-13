const { validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const emailService = require('../services/emailService');

/**
 * @desc    Submit brand contact inquiry form
 * @route   POST /api/contact
 */
exports.submitContactForm = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, subject, message } = req.body;

    try {
        const contact = await Contact.create({
            name,
            email,
            phone,
            subject,
            message
        });

        // Send confirmation email to prospect
        await emailService.sendContactThankYouEmail(email, name);

        // Send alert email to administrative inbox
        await emailService.sendAdminContactNotification(process.env.EMAIL_USER, contact);

        res.status(201).json({
            success: true,
            message: 'Your inquiry has been submitted successfully. A representative will contact you shortly.',
            contact
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Retrieve all contact inquiries (Admin desk)
 * @route   GET /api/contact/admin
 */
exports.getAdminContacts = async (req, res, next) => {
    try {
        const inquiries = await Contact.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: inquiries.length,
            inquiries
        });
    } catch (error) {
        next(error);
    }
};
