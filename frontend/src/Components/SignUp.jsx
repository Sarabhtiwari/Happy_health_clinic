import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

const SignUp = () => {
  const navigate = useNavigate();

  // "form" = registration screen, "otp" = otp verification screen
  const [screen, setScreen] = useState("form");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mob_no: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ── Step 1: Submit registration form → trigger OTP send ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    if (formData.password !== formData.confirmPassword) {
      return setStatus({ type: "error", message: "Passwords do not match." });
    }
    if (!/^\d{10}$/.test(formData.mob_no)) {
      return setStatus({
        type: "error",
        message: "Please enter a valid 10-digit mobile number.",
      });
    }

    setIsLoading(true);
    try {
      await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        mob_no: formData.mob_no,
        password: formData.password,
      });

      setStatus({ type: "success", message: `OTP sent to ${formData.email}` });
      setScreen("otp");
      startResendCooldown();
    } catch (err) {
      const errorMessage =
        err.response?.data?.err || "Registration failed. Please try again.";
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Step 2: Submit OTP ──
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setIsLoading(true);
    try {
      await api.post("/auth/verify-otp", {
        email: formData.email,
        otp: otp.trim(),
      });

      setStatus({
        type: "success",
        message: "Registration successful! Redirecting to login...",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const errorMessage =
        err.response?.data?.err || "Verification failed. Please try again.";
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Resend OTP ──
  const handleResend = async () => {
    setStatus({ type: "", message: "" });
    try {
      await api.post("/auth/resend-otp", { email: formData.email });
      setStatus({ type: "success", message: "New OTP sent successfully." });
      startResendCooldown();
    } catch (err) {
      const errorMessage = err.response?.data?.err || "Failed to resend OTP.";
      setStatus({ type: "error", message: errorMessage });
    }
  };

  // 60 second countdown for resend button
  const startResendCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const inputClass =
    "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100">
        {/* ── SCREEN 1: Registration Form ── */}
        {screen === "form" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Join Happy Health Clinic
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Create an account to book and manage your appointments.
              </p>
            </div>

            {status.message && (
              <div
                className={`mb-4 p-3 rounded text-sm font-medium ${status.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              >
                {status.message}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number
                </label>
                <input
                  name="mob_no"
                  type="tel"
                  required
                  value={formData.mob_no}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="9800000000"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={inputClass}
                  placeholder="••••••••"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-green-600 hover:text-green-500"
                >
                  Log in here
                </a>
              </p>
            </div>
          </>
        )}

        {/* ── SCREEN 2: OTP Verification ── */}
        {screen === "otp" && (
          <>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Verify Your Email
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                We sent a 6-digit OTP to{" "}
                <span className="font-semibold text-gray-800">
                  {formData.email}
                </span>
              </p>
            </div>

            {status.message && (
              <div
                className={`mb-4 p-3 rounded text-sm font-medium ${status.type === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
              >
                {status.message}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // digits only
                  className={`${inputClass} text-center text-2xl tracking-widest font-bold`}
                  placeholder="------"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 transition-colors ${isLoading ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-500">Didn't receive the OTP?</p>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className={`text-sm font-medium transition-colors ${resendCooldown > 0 ? "text-gray-400 cursor-not-allowed" : "text-green-600 hover:text-green-500"}`}
              >
                {resendCooldown > 0
                  ? `Resend OTP in ${resendCooldown}s`
                  : "Resend OTP"}
              </button>
              <br />
              <button
                onClick={() => {
                  setScreen("form");
                  setStatus({ type: "", message: "" });
                }}
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                ← Back to registration
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp;
