const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {
  registerSendOtp,
  registerVerifyOtp,
  loginSendOtp,
  loginVerifyOtp,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// Rate limiter for OTP send endpoints: 5 requests per 10 minutes per IP
const otpSendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many OTP requests. Please try again after some time.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Registration OTP flow
router.post('/register/send-otp', otpSendLimiter, registerSendOtp);
router.post('/register/verify-otp', registerVerifyOtp);

// Login OTP flow (same endpoints for both users and admin)
router.post('/login/send-otp', otpSendLimiter, loginSendOtp);
router.post('/login/verify-otp', loginVerifyOtp);

// Protected route
router.get('/me', protect, getMe);

module.exports = router;
