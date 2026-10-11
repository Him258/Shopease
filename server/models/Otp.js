const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const otpSchema = new mongoose.Schema(
  {
    mobile: {
      type: String,
      required: true,
      index: true,
    },
    // OTP is hashed with bcrypt before storage — plaintext is never persisted
    otpHash: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ['register', 'login'],
      required: true,
    },
    // Stores the user's name during registration flow (before user is created)
    pendingName: {
      type: String,
      default: '',
    },
    // TTL index: MongoDB automatically deletes the document after this time
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
    // Track wrong verification attempts (max 5 before invalidation)
    attempts: {
      type: Number,
      default: 0,
    },
    // Enforces 30-second cooldown between resend requests
    lastSentAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Hash the raw OTP using bcrypt before saving
otpSchema.statics.hashOtp = async function (rawOtp) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(rawOtp, salt);
};

// Compare a raw OTP against the stored hash
otpSchema.methods.verifyOtp = async function (rawOtp) {
  return bcrypt.compare(rawOtp, this.otpHash);
};

module.exports = mongoose.model('Otp', otpSchema);
