import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import useAuthStore from "../zustand/UseAuthStore";

const Login = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setIsLoading(true);

    try {
      const response = await api.post("/auth/signin", {
        email: formData.email,
        password: formData.password,
      });

      const userData = response.data.data;
      const successMessage = response.data.message;

      const formattedUser = {
        name: userData.name,
        email: userData.email,
        userRole: userData.role,
      };

      setAuth(formattedUser);

      setStatus({
        type: "success",
        message: successMessage || "Successfully logged in!",
      });

      if (userData.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.err ||
        "Login failed. Please check your credentials.";
      setStatus({ type: "error", message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Changed bg-gray-50 to bg-white
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Container is kept white with a subtle border for depth */}
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-stone-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Log in to your Happy Health Clinic account.
          </p>
        </div>

        {status.message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium text-center ${
              status.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-green-50 text-green-700"
            }`}
          >
            {status.message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-stone-900 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-stone-900 hover:bg-stone-800 transition-all ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-stone-600">
            Don't have an account?{" "}
            <a href="/signup" className="font-bold text-stone-900 hover:underline">
              Sign up here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;