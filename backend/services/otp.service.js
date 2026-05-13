const OtpVerification = require("../models/otpVerification.model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (userData) => {
  try {
    const { email } = userData;
     
    //60 sec cooldown
    const existing = await OtpVerification.findOne({ email });

    if (existing) {
      const secondsSinceLastSent =
        (Date.now() - existing.lastSentAt) / 1000;

      if (secondsSinceLastSent < 60) {
        throw {
          code: 429,
          err: `Please wait ${Math.ceil(
            60 - secondsSinceLastSent
          )} seconds before requesting a new OTP.`,
        };
      }
    }

    const otp = generateOtp();

    await OtpVerification.findOneAndUpdate(
      { email },
      {
        email,
        pendingUserData: userData,
        otp,
        attempts: 0,
        lastSentAt: new Date(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { upsert: true, new: true }
    );

    await transporter.sendMail({
      from: `"Happy Health Clinic" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP for Registration",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
          <h2 style="color: #16a34a;">Happy Health Clinic</h2>
          <p>Your OTP for registration is:</p>
          <h1 style="letter-spacing: 8px; color: #111;">${otp}</h1>
          <p>This OTP expires in <strong>10 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return {
      success: true,
      message: "OTP sent successfully",
    };
  } catch (error) {
    console.error("Error in sendOtp:", error);

    throw {
      code: error.code || 500,
      err: error.err || "Failed to send OTP",
    };
  }
};

const verifyOtp = async (email, otp, createUserFn) => {
  try {
    const record = await OtpVerification.findOne({ email });

    if (!record) {
      throw {
        code: 404,
        err: "OTP expired or not found. Please request a new one.",
      };
    }

    if (record.expiresAt < new Date()) {
      await OtpVerification.deleteOne({ email });

      throw {
        code: 410,
        err: "OTP has expired. Please request a new one.",
      };
    }

    if (record.attempts >= 5) {
      await OtpVerification.deleteOne({ email });

      throw {
        code: 429,
        err: "Too many wrong attempts. Please request a new OTP.",
      };
    }

    if (record.otp !== otp) {
      await OtpVerification.findOneAndUpdate(
        { email },
        { $inc: { attempts: 1 } }
      );

      const remaining = 4 - record.attempts;

      throw {
        code: 400,
        err: `Incorrect OTP. ${remaining} attempt(s) remaining.`,
      };
    }

    const newUser = await createUserFn(record.pendingUserData);

    await OtpVerification.deleteOne({ email });

    return newUser;
  } catch (error) {
    console.error("Error in verifyOtp:", error);

    throw {
      code: error.code || 500,
      err: error.err || "OTP verification failed",
    };
  }
};

module.exports = { sendOtp, verifyOtp };