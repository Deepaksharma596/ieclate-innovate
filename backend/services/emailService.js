const nodemailer = require('nodemailer');

// Initialize Nodemailer SMTP transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
});

transporter.verify(function (error, success) {
    if (error) {
        console.error("SMTP Verify Error:", error);
    } else {
        console.log("SMTP Server Ready");
    }
});

// Common Email wrapper structure
const baseEmailTemplate = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #061121; margin: 0; padding: 20px; color: #ffffff; }
        .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #0b224c 0%, #061121 100%); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .header { text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 20px; }
        .logo-text { font-size: 24px; font-weight: 800; color: #ffffff; text-decoration: none; }
        .logo-text span { color: #00c6ff; }
        .content { padding: 25px 0; line-height: 1.6; font-size: 16px; color: #a5b4fc; }
        .highlight-text { color: #ffffff; font-weight: 600; }
        .cta-box { text-align: center; margin: 25px 0; padding: 20px; background: rgba(0, 198, 255, 0.05); border: 1px solid rgba(0, 198, 255, 0.2); border-radius: 8px; }
        .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #00c6ff; text-align: center; }
        .button { display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #1565ff 0%, #00c6ff 100%); color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; box-shadow: 0 4px 15px rgba(0, 198, 255, 0.25); }
        .footer { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; font-size: 12px; text-align: center; color: #64748b; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="https://ieclateinovate.com" class="logo-text">IECLATE <span>INOVATE</span></a>
        </div>
        <div class="content">
            ${bodyContent}
        </div>
        <div class="footer">
            <p>&copy; 2026 IECLATE INOVATE. All Rights Reserved.</p>
            <p>Bhorki, Jhunjhunu, Rajasthan</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Generic email dispatch wrapper
 */
const sendMail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"IECLATE INOVATE" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log(`[Nodemailer] Email successfully sent to ${to}. Message ID: ${info.messageId}`);
    } catch (error) {
        console.error(`[Nodemailer] Dispatch Error: ${error.message}`);
    }
};

/**
 * 1. Dispatch Register or Forgot-Password verification OTP
 */
exports.sendOtpEmail = async (email, otp, type) => {
    const title = type === 'register' ? 'Verify Your Account' : 'Reset Your Password';
    const description = type === 'register' 
        ? 'Thank you for registering with IECLATE INOVATE. Please enter the following 4-digit code to verify your email address.'
        : 'A password reset request was initiated for your account. Please enter the following 4-digit verification code.';

    const html = baseEmailTemplate(title, `
        <h2>${title}</h2>
        <p>${description}</p>
        <div class="cta-box">
            <div class="otp-code">${otp}</div>
        </div>
        <p>This verification code is active for 5 minutes. If you did not request this, please ignore this email.</p>
    `);

    await sendMail(email, `IECLATE INOVATE - ${title} Code`, html);
};

/**
 * 2. Send Welcome Email on verification success
 */
exports.sendWelcomeEmail = async (email, name) => {
    const html = baseEmailTemplate('Welcome to IECLATE INOVATE', `
        <h2>Welcome aboard, ${name}!</h2>
        <p>Your account verification was completed successfully. You now have complete access to book consultation slots, review details, and collaborate on events, gifting, and recruitment projects.</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="https://ieclateinovate.com/html/login.html" class="button">Log In to Dashboard</a>
        </div>
    `);

    await sendMail(email, 'Welcome to IECLATE INOVATE!', html);
};

/**
 * 3. Meeting Request Received notification
 */
exports.sendMeetingRequestEmail = async (email, name, meeting) => {
    const html = baseEmailTemplate('Meeting Request Received', `
        <h2>Hello ${name},</h2>
        <p>We have successfully logged your B2B executive consultation booking request. Our administrator is auditing details, calendar availability, and required templates.</p>
        <div class="cta-box" style="text-align: left;">
            <p><span class="highlight-text">Service Area:</span> ${meeting.service.toUpperCase()}</p>
            <p><span class="highlight-text">Preferred Date:</span> ${new Date(meeting.date).toDateString()}</p>
            <p><span class="highlight-text">Time Slot:</span> ${meeting.time}</p>
        </div>
        <p>A coordinator will finalize the session and send a virtual conference link shortly.</p>
    `);

    await sendMail(email, 'IECLATE INOVATE - Meeting Request Logged', html);
};

/**
 * 4. Meeting Confirmation details dispatch
 */
exports.sendMeetingApprovedEmail = async (email, name, meeting) => {
    const html = baseEmailTemplate('Meeting Confirmed', `
        <h2>Meeting Confirmed!</h2>
        <p>Hello ${name}, your booking request has been finalized and approved by our administrator.</p>
        <div class="cta-box" style="text-align: left;">
            <p><span class="highlight-text">Service Area:</span> ${meeting.service.toUpperCase()}</p>
            <p><span class="highlight-text">Confirmed Date:</span> ${new Date(meeting.date).toDateString()}</p>
            <p><span class="highlight-text">Confirmed Time:</span> ${meeting.time}</p>
            <p style="margin-top: 15px;"><span class="highlight-text">Join Link:</span> <a href="${meeting.link}" style="color: #00c6ff;">${meeting.link}</a></p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${meeting.link}" class="button">Join Virtual Session</a>
        </div>
    `);

    await sendMail(email, 'IECLATE INOVATE - Meeting Confirmed', html);
};

/**
 * 5. Meeting Rejection notice
 */
exports.sendMeetingRejectedEmail = async (email, name, reason) => {
    const html = baseEmailTemplate('Meeting Rescheduling Required', `
        <h2>Meeting Update</h2>
        <p>Hello ${name}, your booking request could not be finalized at this time due to the following reason:</p>
        <div class="cta-box" style="text-align: left; border-color: #ff5f56; background: rgba(255, 95, 86, 0.05);">
            <p style="color: #ff5f56; font-weight: 600;">Reason: ${reason}</p>
        </div>
        <p>Please log in or contact our direct help desk to schedule an alternative calendar slot.</p>
    `);

    await sendMail(email, 'IECLATE INOVATE - Meeting Request Update', html);
};

/**
 * 6. Meeting Rescheduling details
 */
exports.sendMeetingRescheduledEmail = async (email, name, meeting) => {
    const html = baseEmailTemplate('Meeting Rescheduled', `
        <h2>Meeting Rescheduled</h2>
        <p>Hello ${name}, your executive consultation has been updated with new schedule coordinates.</p>
        <div class="cta-box" style="text-align: left;">
            <p><span class="highlight-text">New Date:</span> ${new Date(meeting.date).toDateString()}</p>
            <p><span class="highlight-text">New Time Slot:</span> ${meeting.time}</p>
            <p><span class="highlight-text">Join Link:</span> <a href="${meeting.link}" style="color: #00c6ff;">${meeting.link}</a></p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
            <a href="${meeting.link}" class="button">Join Rescheduled Session</a>
        </div>
    `);

    await sendMail(email, 'IECLATE INOVATE - Meeting Rescheduled', html);
};

/**
 * 7. Contact Form Thank You email
 */
exports.sendContactThankYouEmail = async (email, name) => {
    const html = baseEmailTemplate('Message Received', `
        <h2>Thank you for contacting us, ${name}!</h2>
        <p>We have received your request submitted through the brand form. Our direct coordinators will audit the specifications and reach out back shortly.</p>
    `);

    await sendMail(email, 'IECLATE INOVATE - Contact Form Logged', html);
};

/**
 * 8. Admin Notification when contact form is submitted
 */
exports.sendAdminContactNotification = async (adminEmail, contact) => {
    const html = baseEmailTemplate('New Contact Inquiry', `
        <h2>New Client Inquiry Received</h2>
        <div class="cta-box" style="text-align: left;">
            <p><span class="highlight-text">Name:</span> ${contact.name}</p>
            <p><span class="highlight-text">Email:</span> ${contact.email}</p>
            <p><span class="highlight-text">Phone:</span> ${contact.phone}</p>
            <p><span class="highlight-text">Subject:</span> ${contact.subject}</p>
            <p style="margin-top: 15px;"><span class="highlight-text">Message:</span> ${contact.message}</p>
        </div>
    `);

    await sendMail(adminEmail, 'IECLATE INOVATE - New Contact Alert', html);
};
