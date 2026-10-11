const Razorpay = require('razorpay');

/**
 * Returns an initialized Razorpay instance.
 * Throws a descriptive error if environment keys are not configured.
 */
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId.trim() === '' || keySecret.trim() === '') {
    const error = new Error(
      'Razorpay API Keys are missing. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env file.'
    );
    error.statusCode = 500;
    throw error;
  }

  return new Razorpay({
    key_id: keyId.trim(),
    key_secret: keySecret.trim(),
  });
};

module.exports = { getRazorpayInstance };
