const OtpVerification = require("../models/otpVerification.model");
const { BrevoClient } = require("@getbrevo/brevo");

// ── Correct way to init Brevo in latest version ──
const brevoClient = new BrevoClient({ apiKey: process.env.BREVO_API_KEY });

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const sendOtp = async (userData) => {
  try {
    const { email, name } = userData;

    const existing = await OtpVerification.findOne({ email });
    if (existing) {
      const secondsSinceLastSent = (Date.now() - existing.lastSentAt) / 1000;
      if (secondsSinceLastSent < 60) {
        throw {
          code: 429,
          err: `Please wait ${Math.ceil(60 - secondsSinceLastSent)} seconds before requesting a new OTP.`,
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
      { upsert: true, returnDocument: "after" }
    );

    // ── New API call format ──
    await brevoClient.transactionalEmails.sendTransacEmail({
      subject: "Your OTP for Registration - Happy Health Clinic",
      to: [{ email, name: name || "User" }],
      sender: {
        name: "Happy Health Clinic",
        email: process.env.BREVO_SENDER_EMAIL,
      },
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px;">
          <h2 style="color: #16a34a;">Happy Health Clinic</h2>
          <p style="color: #374151;">Hi <strong>${name || "User"}</strong>,</p>
          <p style="color: #374151;">Your OTP for registration is:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 12px; color: #111827; margin: 24px 0;">${otp}</div>
          <p style="color: #6b7280; font-size: 14px;">This OTP expires in <strong>10 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 14px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return { success: true, message: "OTP sent successfully" };

  } catch (error) {
    console.error("Error in sendOtp:", error);
    throw {
      code: typeof error.code === "number" ? error.code : 500,
      err: error.err || "Failed to send OTP. Please try again.",
    };
  }
};

const verifyOtp = async (email, otp, createUserFn) => {
  try {
    const record = await OtpVerification.findOne({ email });

    if (!record) {
      throw { code: 404, err: "OTP expired or not found. Please request a new one." };
    }
    if (record.expiresAt < new Date()) {
      await OtpVerification.deleteOne({ email });
      throw { code: 410, err: "OTP has expired. Please request a new one." };
    }
    if (record.attempts >= 5) {
      await OtpVerification.deleteOne({ email });
      throw { code: 429, err: "Too many wrong attempts. Please request a new OTP." };
    }
    if (record.otp !== otp) {
      await OtpVerification.findOneAndUpdate({ email }, { $inc: { attempts: 1 } });
      const remaining = 4 - record.attempts;
      throw { code: 400, err: `Incorrect OTP. ${remaining} attempt(s) remaining.` };
    }

    const newUser = await createUserFn(record.pendingUserData);
    await OtpVerification.deleteOne({ email });
    return newUser;

  } catch (error) {
    console.error("Error in verifyOtp:", error);
    throw {
      code: typeof error.code === "number" ? error.code : 500,
      err: error.err || "OTP verification failed",
    };
  }
};

module.exports = { sendOtp, verifyOtp };