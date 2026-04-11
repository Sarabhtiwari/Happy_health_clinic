import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./NavBar";
import formatError from "../utils/errorFormatter";

const PaymentPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initiatingPayment, setInitiatingPayment] = useState(false);

  // Fetch appointment details
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("You must be logged in to proceed with payment");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/hhc/api/v1/appointments/${appointmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAppointment(response.data.data);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.err ||
          err.message ||
          "Failed to fetch appointment details";
        setError(errorMessage);
        setLoading(false);
      }
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  // Handle payment initiation
  const handleInitiatePayment = async () => {
    setInitiatingPayment(true);
    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `http://localhost:5000/hhc/api/v1/payment/initiate/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Redirect to Khalti payment URL
      const { paymentUrl } = response.data.data;
      window.location.href = paymentUrl;
    } catch (err) {
      const errorMessage =
        err.response?.data?.err ||
        err.message ||
        "Failed to initiate payment";
      setError(errorMessage);
      setInitiatingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-serif text-blue-600 animate-pulse">
          Loading payment details...
        </div>
      </div>
    );
  }

  if (error && !appointment) {
    return (
      <div className="py-24 bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <h2 className="text-2xl font-serif font-bold text-red-600 mb-2">
                Payment Error
              </h2>
              <p className="text-red-700 mb-6">{formatError(error)}</p>
              <div className="flex gap-4">
                <button
                  onClick={() => navigate("/appointments")}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  View My Appointments
                </button>
                <button
                  onClick={() => navigate("/doctors")}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Book Another Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if appointment is already paid
  if (appointment?.paymentStatus === 'PAID') {
    return (
      <div className="py-24 bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
              <h2 className="text-2xl font-serif font-bold text-green-600 mb-2">
                Already Paid
              </h2>
              <p className="text-green-700 mb-6">
                This appointment has already been paid for.
              </p>
              <button
                onClick={() => navigate("/appointments")}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                View My Appointments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Complete Your Payment
            </h1>
            <p className="text-lg text-gray-600">
              Secure payment for your doctor appointment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Appointment Details */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Appointment Details
              </h2>

              <div className="space-y-6">
                {/* Doctor Info */}
                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-200">
                    <img
                      alt={appointment?.doctor?.user?.name}
                      className="w-full h-full object-cover"
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        appointment?.doctor?.user?.name || "Doctor"
                      )}&background=0D8ABC&color=fff&size=64`}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-bold text-gray-900">
                      Dr. {appointment?.doctor?.user?.name}
                    </h3>
                    <p className="text-gray-600">
                      {appointment?.doctor?.qualification || "Medical Doctor"}
                    </p>
                  </div>
                </div>

                {/* Appointment Info */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Appointment No:</span>
                    <span className="text-gray-900 font-semibold">
                      #{appointment?.appointmentNo}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Date:</span>
                    <span className="text-gray-900 font-semibold">
                      {appointment?.dateOfAppointment
                        ? new Date(appointment.dateOfAppointment).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'N/A'
                      }
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Time:</span>
                    <span className="text-gray-900 font-semibold">
                      {appointment?.dateOfAppointment
                        ? new Date(appointment.dateOfAppointment).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'
                      }
                    </span>
                  </div>

                  {appointment?.description && (
                    <div className="py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium block mb-2">Description:</span>
                      <span className="text-gray-900 font-semibold">
                        {appointment.description}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg">
                    <span className="text-gray-600 font-medium">Payment Status:</span>
                    <span className={`inline-flex px-3 py-1 rounded-full font-semibold text-sm ${
                      appointment?.paymentStatus === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : appointment?.paymentStatus === 'FAILED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment?.paymentStatus || 'PENDING'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Payment Summary
              </h2>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                  <p className="text-red-700 font-medium">{formatError(error)}</p>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Consultation Fee:</span>
                  <span className="text-gray-900 font-semibold">
                    NPR {appointment?.doctor?.fees || 0}
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Processing Fee:</span>
                  <span className="text-gray-900 font-semibold">Free</span>
                </div>

                <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg border-2 border-blue-200">
                  <span className="font-semibold text-gray-900 text-lg">Total Amount:</span>
                  <span className="font-bold text-blue-600 text-xl">
                    NPR {appointment?.doctor?.fees || 0}
                  </span>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-8">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">💳</span>
                  <h3 className="font-semibold text-yellow-800">Secure Payment</h3>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  You'll be redirected to Khalti, Nepal's trusted digital wallet, to complete your payment securely.
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Multiple payment options (Mobile, Bank, Cards)</li>
                  <li>• 256-bit SSL encryption</li>
                  <li>• No additional charges</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <button
                  onClick={handleInitiatePayment}
                  disabled={initiatingPayment}
                  className={`w-full px-8 py-4 font-semibold rounded-lg text-white transition-all duration-300 ${
                    initiatingPayment
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105"
                  }`}
                >
                  {initiatingPayment ? (
                    <span className="flex items-center justify-center">
                      <span className="animate-spin inline-block w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full"></span>
                      Connecting to Khalti...
                    </span>
                  ) : (
                    `Pay NPR ${appointment?.doctor?.fees || 0} Now`
                  )}
                </button>

                <button
                  onClick={() => navigate("/appointments")}
                  disabled={initiatingPayment}
                  className="w-full px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Back to My Appointments
                </button>
              </div>

              {/* Terms */}
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  By proceeding, you agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
