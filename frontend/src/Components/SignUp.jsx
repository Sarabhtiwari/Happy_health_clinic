import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "./NavBar";

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

  // NEW: States to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
    "block w-full px-4 py-3 bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-xl text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-stone-900 dark:focus:ring-blue-500 transition-all placeholder-stone-400";

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-stone-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
        <div className="max-w-md w-full bg-white dark:bg-stone-800 p-8 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm transition-colors duration-300">
          
          {/* ── SCREEN 1: Registration Form ── */}
          {screen === "form" && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                  Join Happy Health Clinic
                </h2>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 transition-colors duration-300">
                  Create an account to book and manage your appointments.
                </p>
              </div>

              {status.message && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${
                    status.type === "error"
                      ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
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
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
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
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
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
                
                {/* ── Password Field with Toggle ── */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputClass} pr-12`} // Added pr-12
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 focus:outline-none"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* ── Confirm Password Field with Toggle ── */}
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`${inputClass} pr-12`} // Added pr-12
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 focus:outline-none"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-stone-600 dark:text-stone-400">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                  >
                    Log in here
                  </a>
                </p>
              </div>
            </>
          )}

          {/* ── SCREEN 2: OTP Verification (Unchanged) ── */}
          {screen === "otp" && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-stone-900 dark:text-white transition-colors duration-300">
                  Verify Your Email
                </h2>
                <p className="mt-2 text-sm text-stone-500 dark:text-stone-400 transition-colors duration-300">
                  We sent a 6-digit OTP to{" "}
                  <span className="font-semibold text-stone-900 dark:text-white">
                    {formData.email}
                  </span>
                </p>
              </div>

              {status.message && (
                <div
                  className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${
                    status.type === "error"
                      ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleVerifyOtp}>
                <div>
                  <label className="block text-sm font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className={`${inputClass} text-center text-2xl tracking-widest font-bold`}
                    placeholder="------"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 dark:bg-blue-600 dark:hover:bg-blue-700 transition-all ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>

              <div className="mt-6 text-center space-y-3">
                <p className="text-sm text-stone-500 dark:text-stone-400">Didn't receive the OTP?</p>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0}
                  className={`text-sm font-bold transition-colors ${
                    resendCooldown > 0
                      ? "text-stone-400 dark:text-stone-500 cursor-not-allowed"
                      : "text-stone-900 dark:text-white hover:underline"
                  }`}
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
                  className="text-xs font-semibold text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 underline mt-2 inline-block"
                >
                  ← Back to registration
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SignUp;