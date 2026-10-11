const axios = require('axios');

/**
 * Sends an OTP to the given mobile number.
 * Controlled by env OTP_MODE:
 *   - "dev"  → logs OTP to server console only (no SMS sent)
 *   - "sms"  → sends via Fast2SMS (or swap your provider below)
 *
 * IMPORTANT: The raw OTP is only used here for delivery.
 * It must be hashed before storage and never included in API responses.
 */
const sendOtp = async (mobile, otp) => {
  const mode = process.env.OTP_MODE || 'dev';

  if (mode === 'dev') {
    // Development mode: print to server console for testing
    console.log(`[DEV OTP] ${mobile}: ${otp}`);
    return { success: true, mode: 'dev' };
  }

  if (mode === 'sms') {
    return sendViaFast2SMS(mobile, otp);
  }

  // Fallback to dev mode for unknown OTP_MODE values
  console.log(`[DEV OTP] ${mobile}: ${otp}`);
  return { success: true, mode: 'dev' };
};

/**
 * Fast2SMS provider implementation.
 * Docs: https://docs.fast2sms.com/
 *
 * Required env: SMS_API_KEY
 *
 * TODO: Replace route "otp" with "dlt_manual" and set template_id / sender_id
 *       once your DLT registration is approved for production use.
 */
const sendViaFast2SMS = async (mobile, otp) => {
  const apiKey = process.env.SMS_API_KEY;
  if (!apiKey) {
    console.error('SMS_API_KEY is not configured');
    return { success: false, error: 'SMS service not configured' };
  }

  try {
    const response = await axios.post(
      'https://www.fast2sms.com/dev/bulkV2',
      {
        route: 'otp',
        variables_values: otp,
        numbers: mobile,
        // TODO: Add these fields for DLT-registered templates:
        // sender_id: 'YOUR_SENDER_ID',
        // message: 'YOUR_DLT_TEMPLATE_WITH_{#var#}',
      },
      {
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
      }
    );

    return { success: response.data?.return === true, data: response.data };
  } catch (error) {
    console.error('Fast2SMS error:', error.response?.data || error.message);
    return { success: false, error: 'Failed to send SMS' };
  }
};

module.exports = sendOtp;
