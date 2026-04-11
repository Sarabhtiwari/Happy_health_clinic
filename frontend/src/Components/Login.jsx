import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [status, setStatus] = useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });
    setIsLoading(true);

    try {
      // Adjust this URL to match your Express backend route (e.g., /api/auth/signin)
      const response = await axios.post('http://localhost:5000/hhc/api/v1/auth/signin', {
        email: formData.email,
        password: formData.password
      });

      // Your backend returns successResponseBody with a 'data' object containing the token
      const { token,role } = response.data.data;
      const successMessage = response.data.message;
      
      // Store the JWT token in localStorage so it can be used for future authenticated requests
      localStorage.setItem('authToken', token);

      setStatus({ type: 'success', message: successMessage || 'Successfully logged in!' });
      
      // Here you would typically redirect the user based on their role using React Router
      if (role === 'admin') navigate('/admin-dashboard'); //  BEWARE TO MAKE
      else navigate('/');

    } catch (err) {
      // Your backend sets the error message in the 'err' property of errorResponseBody
      const errorMessage = err.response?.data?.err || 'Login failed. Please check your credentials.';
      setStatus({ type: 'error', message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-gray-100">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Log in to your Happy Health Clinic account.
          </p>
        </div>

        {/* Status Messages */}
        {status.message && (
          <div className={`mb-4 p-3 rounded text-sm font-medium text-center ${
            status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {status.message}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition-colors"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="font-medium text-green-600 hover:text-green-500 transition-colors">
              Sign up here
            </a>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default Login;