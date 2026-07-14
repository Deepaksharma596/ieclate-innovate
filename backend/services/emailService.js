const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const baseEmailTemplate = (title, bodyContent) => `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
body{font-family:'Segoe UI',sans-serif;background:#061121;color:#fff;padding:20px}
.container{max-width:600px;margin:auto;background:#0b224c;padding:30px;border-radius:12px}
.otp{font-size:32px;font-weight:bold;letter-spacing:6px;color:#00c6ff;text-align:center}
</style>
</head>
<body>
<div class="container">
${bodyContent}
</div>
</body>
</html>`;

async function sendMail(to, subject, html) {
  try {
    const result = await resend.emails.send({
      from: "IECLATE INOVATE <onboarding@resend.dev>", // replace with your verified domain later
      to,
      subject,
      html,
    });
    console.log("[Resend] Email sent:", result);
  } catch (err) {
    console.error("[Resend] Error:", err);
  }
}

exports.sendOtpEmail = async (email, otp, type) => {
  const title = type === "register" ? "Verify Your Account" : "Reset Password";
  const html = baseEmailTemplate(title, `
    <h2>${title}</h2>
    <p>Your OTP is:</p>
    <div class="otp">${otp}</div>
    <p>This OTP expires in 5 minutes.</p>
  `);
  await sendMail(email, `IECLATE INOVATE - ${title}`, html);
};

exports.sendWelcomeEmail = async (email, name) => {
  const html = baseEmailTemplate("Welcome", `
    <h2>Welcome ${name}</h2>
    <p>Your account has been verified successfully.</p>
  `);
  await sendMail(email, "Welcome to IECLATE INOVATE", html);
};

exports.sendMeetingRequestEmail = async (email, name, meeting) => {
  const html = baseEmailTemplate("Meeting Request", `
    <h2>Hello ${name}</h2>
    <p>Your meeting request has been received.</p>
    <p>Service: ${meeting.service}</p>
    <p>Date: ${new Date(meeting.date).toDateString()}</p>
    <p>Time: ${meeting.time}</p>
  `);
  await sendMail(email, "Meeting Request Received", html);
};

exports.sendMeetingApprovedEmail = async (email, name, meeting) => {
  const html = baseEmailTemplate("Meeting Confirmed", `
    <h2>Hello ${name}</h2>
    <p>Your meeting has been approved.</p>
    <p><a href="${meeting.link}">${meeting.link}</a></p>
  `);
  await sendMail(email, "Meeting Confirmed", html);
};

exports.sendMeetingRejectedEmail = async (email, name, reason) => {
  const html = baseEmailTemplate("Meeting Update", `
    <h2>Hello ${name}</h2>
    <p>Reason: ${reason}</p>
  `);
  await sendMail(email, "Meeting Update", html);
};

exports.sendMeetingRescheduledEmail = async (email, name, meeting) => {
  const html = baseEmailTemplate("Meeting Rescheduled", `
    <h2>Hello ${name}</h2>
    <p>New Date: ${new Date(meeting.date).toDateString()}</p>
    <p>New Time: ${meeting.time}</p>
    <p><a href="${meeting.link}">${meeting.link}</a></p>
  `);
  await sendMail(email, "Meeting Rescheduled", html);
};

exports.sendContactThankYouEmail = async (email, name) => {
  const html = baseEmailTemplate("Thank You", `
    <h2>Thank you ${name}</h2>
    <p>We have received your enquiry.</p>
  `);
  await sendMail(email, "Thank You for Contacting IECLATE INOVATE", html);
};

exports.sendAdminContactNotification = async (adminEmail, contact) => {
  const html = baseEmailTemplate("New Contact", `
    <h2>New Contact Enquiry</h2>
    <p>Name: ${contact.name}</p>
    <p>Email: ${contact.email}</p>
    <p>Phone: ${contact.phone}</p>
    <p>Subject: ${contact.subject}</p>
    <p>Message: ${contact.message}</p>
  `);
  await sendMail(adminEmail, "New Contact Enquiry", html);
};
'''

path = Path("/mnt/data/emailService.js")
path.write_text(content, encoding="utf-8")

print(path)
