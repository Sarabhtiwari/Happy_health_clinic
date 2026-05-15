const userService = require("../services/user.service");
const otpService = require("../services/otp.service");
const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");

const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password, mob_no } = req.body;

    const existingUser = await userService
      .getUserByEmail(email)
      .catch(() => null);
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, err: "Email already registered." });
    }

    await otpService.sendOtp({
      name,
      email,
      password,
      mob_no,
      userRole: "PATIENT",
    });

    return res.status(200).json({
      success: true,
      message:
        "OTP sent to your email. Please verify to complete registration.",
      data: {},
    });
  } catch (error) {
    const statusCode = typeof error.code === "number" ? error.code : 500;
    return res.status(statusCode).json({
      success: false,
      err: error.err || error.message || "Something went wrong",
    });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, err: "Email and OTP are required." });
    }

    const newUser = await otpService.verifyOtp(
      email,
      otp,
      (userData) => userService.createUser(userData), // createUserFn **
    );

    return res.status(201).json({
      success: true,
      message: "Registration successful! You can now log in.",
      data: { email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    const statusCode = typeof error.code === "number" ? error.code : 500;
    return res.status(statusCode).json({
      success: false,
      err: error.err || error.message || "Something went wrong",
    });
  }
};

const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, err: "Email is required." });
    }
    //// pending data from schema
    const OtpVerification = require("../models/otpVerification.model");
    const existing = await OtpVerification.findOne({ email });
    if (!existing) {
      return res
        .status(404)
        .json({
          success: false,
          err: "No pending registration found for this email.",
        });
    }

    await otpService.sendOtp(existing.pendingUserData);

    return res.status(200).json({
      success: true,
      message: "New OTP sent successfully.",
      data: {},
    });
  } catch (error) {
    const statusCode = typeof error.code === "number" ? error.code : 500;
    return res.status(statusCode).json({
      success: false,
      err: error.err || error.message || "Something went wrong",
    });
  }
};

const signin = async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.body.email);
    const isValidPassword = await user.isValidPassword(req.body.password);

    if (!isValidPassword) {
      throw { err: "Incorrect email or password", code: 401 };
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.AUTH_KEY,
      { expiresIn: "1h" },
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: 3600000,
    });

    successResponseBody.message = "Successfully logged in";
    successResponseBody.data = {
      email: user.email,
      role: user.userRole,
      name: user.name,
    };
    return res.status(200).json(successResponseBody);
  } catch (error) {
    // console.log(error);
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(500).json(errorResponseBody);
  }
};

const signout = async (req, res) => {
  res.cookie("authToken", "", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
    expires: new Date(0),
  });

  successResponseBody.message = "Successfully logged out";
  successResponseBody.data = {};
  return res.status(200).json(successResponseBody);
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        err: "Not authenticated",
      });
    }

    const user = await userService.getUserById(req.user);

    return res.status(200).json({
      success: true,
      message: "Authenticated",
      data: {
        email: user.email,
        role: user.userRole,
        name: user.name,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      err: error.message || error,
    });
  }
};

module.exports = {
  signup,
  signin,
  signout,
  verifyOtp,
  resendOtp,
  getCurrentUser,
};
