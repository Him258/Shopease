const crypto = require('crypto');
const User = require('../models/User');
const Otp = require('../models/Otp');
const generateToken = require('../utils/jwt');
const sendOtp = require('../utils/sendOtp');

// Indian mobile number format: starts with 6-9, exactly 10 digits
const MOBILE_REGEX = /^[6-9]\d{9}$/;
// OTP validity window in milliseconds (5 minutes)
const OTP_EXPIRY_MS = 5 * 60 * 1000;
// Minimum gap between OTP sends in milliseconds (30 seconds)
const RESEND_COOLDOWN_MS = 30 * 1000;
// Maximum wrong OTP attempts before invalidation
const MAX_ATTEMPTS = 5;

/**
 * Generate a cryptographically secure 6-digit OTP using crypto.randomInt.
 * Range: 100000–999999 (always 6 digits, never starts with 0).
 */
const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * @desc    Step 1 of registration: validate name+mobile, send OTP
 * @route   POST /api/auth/register/send-otp
 * @access  Public
 */
const registerSendOtp = async (req, res, next) => {
  try {
    const { name, mobile } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    if (!mobile || !MOBILE_REGEX.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number' });
    }

    // Block registration if mobile is already registered (including the admin)
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This mobile number is already registered. Please login instead.' });
    }

    // Block registration with the admin mobile even if admin user doesn't exist yet
    if (process.env.ADMIN_MOBILE && mobile === process.env.ADMIN_MOBILE) {
      return res.status(400).json({ success: false, message: 'This mobile number is already registered. Please login instead.' });
    }

    // Enforce 30-second resend cooldown
    const recentOtp = await Otp.findOne({ mobile, purpose: 'register' });
    if (recentOtp) {
      const elapsed = Date.now() - new Date(recentOtp.lastSentAt).getTime();
      if (elapsed < RESEND_COOLDOWN_MS) {
        const waitSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSec} seconds before requesting a new OTP`,
        });
      }
      // Remove stale OTP before creating a new one
      await Otp.deleteMany({ mobile, purpose: 'register' });
    }

    // Generate, hash, and store the OTP
    const rawOtp = generateOtp();
    const otpHash = await Otp.hashOtp(rawOtp);

    await Otp.create({
      mobile,
      otpHash,
      purpose: 'register',
      pendingName: name.trim(),
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
      attempts: 0,
      lastSentAt: new Date(),
    });

    // Deliver OTP (dev mode: console, sms mode: Fast2SMS)
    await sendOtp(mobile, rawOtp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Step 2 of registration: verify OTP, create user
 * @route   POST /api/auth/register/verify-otp
 * @access  Public
 */
const registerVerifyOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !MOBILE_REGEX.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid mobile number' });
    }
    if (!otp || otp.length !== 6) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 6-digit OTP' });
    }

    const otpRecord = await Otp.findOne({ mobile, purpose: 'register' });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new one.' });
    }

    // Check max wrong attempts (5 strikes → invalidate)
    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: 'Too many wrong attempts. Please request a new OTP.' });
    }

    // Verify OTP hash
    const isValid = await otpRecord.verifyOtp(otp);
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = MAX_ATTEMPTS - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Invalid OTP. ${remaining} attempt(s) remaining.`
          : 'Too many wrong attempts. Please request a new OTP.',
      });
    }

    // OTP is single-use: delete after successful verification
    await Otp.deleteOne({ _id: otpRecord._id });

    // Double-check no duplicate user was created in the meantime
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This mobile number is already registered.' });
    }

    // Create user — role is always forced to 'user' (never trust client input)
    const user = await User.create({
      name: otpRecord.pendingName,
      mobile,
      role: 'user',
      isVerified: true,
    });

    return res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Step 1 of login: validate mobile exists, send OTP
 * @route   POST /api/auth/login/send-otp
 * @access  Public
 */
const loginSendOtp = async (req, res, next) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !MOBILE_REGEX.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 10-digit mobile number' });
    }

    // User must be registered to login
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ success: false, message: 'This mobile number is not registered. Please register first.' });
    }

    // Enforce 30-second resend cooldown
    const recentOtp = await Otp.findOne({ mobile, purpose: 'login' });
    if (recentOtp) {
      const elapsed = Date.now() - new Date(recentOtp.lastSentAt).getTime();
      if (elapsed < RESEND_COOLDOWN_MS) {
        const waitSec = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSec} seconds before requesting a new OTP`,
        });
      }
      await Otp.deleteMany({ mobile, purpose: 'login' });
    }

    const rawOtp = generateOtp();
    const otpHash = await Otp.hashOtp(rawOtp);

    await Otp.create({
      mobile,
      otpHash,
      purpose: 'login',
      expiresAt: new Date(Date.now() + OTP_EXPIRY_MS),
      attempts: 0,
      lastSentAt: new Date(),
    });

    await sendOtp(mobile, rawOtp);

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Step 2 of login: verify OTP, return JWT
 * @route   POST /api/auth/login/verify-otp
 * @access  Public
 */
const loginVerifyOtp = async (req, res, next) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !MOBILE_REGEX.test(mobile)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid mobile number' });
    }
    if (!otp || otp.length !== 6) {
      return res.status(400).json({ success: false, message: 'Please provide a valid 6-digit OTP' });
    }

    const otpRecord = await Otp.findOne({ mobile, purpose: 'login' });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Please request a new one.' });
    }

    if (otpRecord.attempts >= MAX_ATTEMPTS) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: 'Too many wrong attempts. Please request a new OTP.' });
    }

    const isValid = await otpRecord.verifyOtp(otp);
    if (!isValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      const remaining = MAX_ATTEMPTS - otpRecord.attempts;
      return res.status(400).json({
        success: false,
        message: remaining > 0
          ? `Invalid OTP. ${remaining} attempt(s) remaining.`
          : 'Too many wrong attempts. Please request a new OTP.',
      });
    }

    // Single-use: delete after success
    await Otp.deleteOne({ _id: otpRecord._id });

    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    // Mark as verified if not already
    if (!user.isVerified) {
      user.isVerified = true;
      await user.save();
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        createdAt: user.createdAt,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged-in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        mobile: user.mobile,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerSendOtp,
  registerVerifyOtp,
  loginSendOtp,
  loginVerifyOtp,
  getMe,
};
