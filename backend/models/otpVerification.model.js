const mongoose = require("mongoose");

const otpVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },

  // Storing full registration data temporarily — no User created yet
  pendingUserData: { type: Object, required: true },

  otp: { type: String, required: true },

  attempts: { type: Number, default: 0 },

  lastSentAt: { type: Date, default: Date.now },

  // auto-delete this document after 10 minutes
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 10 * 60 * 1000),
  },
});

// TTL index — MongoDB daemon checks every 60s and deletes expired docs
otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("OtpVerification", otpVerificationSchema);