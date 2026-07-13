const twilio = require('twilio');

// Safe initialization of Twilio client to prevent crashes if key placeholders are left unmodified
let client = null;
const isTwilioMock = !process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID.startsWith('ACXXXX');

if (!isTwilioMock) {
    try {
        client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    } catch (error) {
        console.error(`[Twilio] Client initialization failed: ${error.message}`);
    }
}

/**
 * Dispatch SMS verification message via Twilio or console logging fallback
 */
exports.sendSMS = async (to, message) => {
    if (client && !isTwilioMock) {
        try {
            const response = await client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to
            });
            console.log(`[Twilio] SMS dispatch success: SID ${response.sid}`);
            return response;
        } catch (error) {
            console.error(`[Twilio] SMS Dispatch Failed: ${error.message}`);
            // Fallback console log for testing
            console.log(`[Twilio Mock Dispatch] SMS to ${to}: ${message}`);
            return null;
        }
    } else {
        // Fallback console log for sandbox local testing
        console.log(`[Twilio Sandbox Dispatch] SMS to ${to}: ${message}`);
        return null;
    }
};
