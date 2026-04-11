import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./NavBar";

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [failureData, setFailureData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState(false);
  const [appointmentId, setAppointmentId] = useState(null);

  useEffect(() => {
    try {
      // Get failure reason from query params
      const status = searchParams.get("status");
      const pidx = searchParams.get("pidx");
      const appointmentIdParam = searchParams.get("appointmentId");

      setAppointmentId(appointmentIdParam);
      setFailureData({
        status: status || "Failed",
        pidx: pidx,
        message: getFailureMessage(status),
      });
      setLoading(false);
    } catch (err) {
      setFailureData({
        status: "Error",
        message: "An unexpected error occurred",
      });
      setLoading(false);
    }
  }, [searchParams]);

  const getFailureMessage = (status) => {
    const messages = {
      "User canceled": "You cancelled the payment. Please try again to complete your appointment booking.",
      Pending: "Your payment is still pending. Please wait or check your transaction status.",
      Initiated: "Your payment was not completed. Please try again.",
      Refunded: "Your payment was refunded. Please contact support for more details.",
      Expired: "Your payment session expired. Please try again.",
      Failed: "Payment processing failed. Please try again or use a different payment method.",
    };
    return (
      messages[status] ||
      "Your payment could not be processed. Please try again."
    );
  };

  const handleRetryPayment = async () => {
    if (!appointmentId) {
      alert("Appointment ID not found. Please go back to your appointments.");
      navigate("/appointments");
      return;
    }

    setRetrying(true);
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.post(
        `http://localhost:5000/hhc/api/v1/payment/initiate/${appointmentId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.data.paymentUrl) {
        window.location.href = response.data.data.paymentUrl;
      }
    } catch (err) {
      alert(
        err.response?.data?.err ||
          err.message ||
          "Failed to initiate payment. Please try again."
      );
      setRetrying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-serif text-blue-600 animate-pulse">
          Processing payment status...
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
            {/* Header with Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
                <span className="text-5xl">❌</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-red-600 mb-2">
                Payment Failed
              </h1>
              <p className="text-gray-600">
                We couldn't process your payment
              </p>
            </div>

            {/* Failure Reason */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-lg font-serif font-bold text-gray-900 mb-4">
                What Happened?
              </h2>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
                <p className="text-red-700">{failureData?.message}</p>
              </div>

              {failureData?.pidx && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Transaction Reference:
                  </p>
                  <p className="font-mono text-sm text-gray-900 break-all">
                    {failureData.pidx}
                  </p>
                </div>
              )}
            </div>

            {/* Troubleshooting */}
            <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
              <h3 className="text-lg font-serif font-bold text-blue-900 mb-3">
                Why Did This Happen?
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start">
                  <span className="mr-3">•</span>
                  <span>Insufficient balance in your Khalti wallet</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">•</span>
                  <span>Invalid payment details or expired card</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">•</span>
                  <span>Network or connection issue during transaction</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">•</span>
                  <span>Payment was cancelled by you or your bank</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-3">•</span>
                  <span>Khalti service temporarily unavailable</span>
                </li>
              </ul>
            </div>

            {/* Help Section */}
            <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <p className="text-sm text-yellow-800">
                <span className="font-semibold">💡 Tip:</span> Make sure you have
                sufficient balance in your Khalti wallet and a stable internet
                connection before retrying.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate("/appointments")}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Appointments
              </button>
              <button
                onClick={handleRetryPayment}
                disabled={retrying || !appointmentId}
                className={`flex-1 px-6 py-3 font-semibold rounded-lg text-white transition-all duration-300 ${
                  retrying || !appointmentId
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105"
                }`}
              >
                {retrying ? (
                  <span className="flex items-center justify-center">
                    <span className="animate-spin inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                    Processing...
                  </span>
                ) : (
                  "Retry Payment"
                )}
              </button>
            </div>

            {/* Support */}
            <div className="mt-8 text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 text-sm mb-3">
                Still having issues with payment?
              </p>
              <a
                href="mailto:support@hhc.com"
                className="inline-block px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
