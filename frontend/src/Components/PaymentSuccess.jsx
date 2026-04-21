import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "./NavBar";
import formatError from "../utils/errorFormatter";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      try {
        // Backend redirects here with pidx and appointmentId in query params
        const pidx = searchParams.get("pidx");
        const appointmentId = searchParams.get("appointmentId");

        if (!pidx || !appointmentId) {
          setError("Payment information is incomplete");
          setLoading(false);
          return;
        }

        // Fetch payment details using the appointment ID
        const paymentResponse = await api.get(`/payment/appointment/${appointmentId}`);

        const payment = paymentResponse.data.data;
        setPaymentData({
          pidx: pidx,
          appointmentId: appointmentId,
          appointmentNo: payment.appointment?.appointmentNo,
          paymentStatus: payment.appointment?.paymentStatus,
          transactionId: payment.transactionId,
          amountNPR: payment.amount / 100, // Convert paisa to NPR
          status: "SUCCESS",
          message: "Your payment has been received and verified",
        });
        setLoading(false);
      } catch (err) {
        console.error("Payment details fetch error:", err);
        setError(
          err.response?.data?.err ||
            err.message ||
            "Failed to fetch payment details"
        );
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-serif text-blue-600 animate-pulse">
          Processing your payment...
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {error ? (
            // Error State
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                  <span className="text-4xl">❌</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-red-600 mb-2">
                  Error Processing Payment
                </h1>
                <p className="text-gray-600">{formatError(error)}</p>
              </div>

              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-8">
                <p className="text-red-700 text-sm">
                  If you were charged but didn't receive confirmation, please
                  contact our support team immediately.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Go to Home
                </button>
                <button
                  onClick={() => navigate("/appointments")}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View My Appointments
                </button>
              </div>
            </div>
          ) : (
            // Success State
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4 animate-bounce">
                  <span className="text-5xl">✅</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-green-600 mb-2">
                  Payment Successful!
                </h1>
                <p className="text-gray-600">
                  Your appointment payment has been received and confirmed
                </p>
              </div>

              {/* Payment Confirmation Details */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-xl font-serif font-bold text-gray-900 mb-6">
                  Confirmation Details
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 bg-gray-50 px-4 rounded-lg">
                    <span className="text-gray-600 font-medium">
                      Appointment Number:
                    </span>
                    <span className="text-gray-900 font-mono text-sm font-semibold">
                      #{paymentData?.appointmentNo}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 bg-gray-50 px-4 rounded-lg">
                    <span className="text-gray-600 font-medium">
                      Transaction ID (PIDX):
                    </span>
                    <span className="text-gray-900 font-mono text-sm font-semibold break-all">
                      {paymentData?.pidx}
                    </span>
                  </div>

                  {paymentData?.transactionId && (
                    <div className="flex justify-between items-center py-3 bg-gray-50 px-4 rounded-lg">
                      <span className="text-gray-600 font-medium">
                        Khalti Transaction ID:
                      </span>
                      <span className="text-gray-900 font-mono text-sm font-semibold break-all">
                        {paymentData.transactionId}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg">
                    <span className="text-gray-600 font-medium">Amount Paid:</span>
                    <span className="text-blue-800 font-bold text-lg">
                      NPR {paymentData?.amountNPR}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg">
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span className="inline-flex px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold text-sm">
                      Completed
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 bg-gray-50 px-4 rounded-lg">
                    <span className="text-gray-600 font-medium">
                      Confirmation Date:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {new Date().toLocaleDateString()} at{" "}
                      {new Date().toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="mb-8 p-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                <h3 className="text-lg font-serif font-bold text-blue-900 mb-3">
                  What's Next?
                </h3>
                <ul className="space-y-2 text-blue-800">
                  <li className="flex items-start">
                    <span className="mr-3">✓</span>
                    <span>
                      Confirmation email has been sent to your registered email
                      address
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3">✓</span>
                    <span>Your appointment is now confirmed and locked</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3">✓</span>
                    <span>
                      You will receive a reminder notification before your
                      appointment
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3">✓</span>
                    <span>
                      The doctor can now see your appointment in their schedule
                    </span>
                  </li>
                </ul>
              </div>

              {/* Important Info */}
              <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">📌 Important:</span> Please
                  arrive 10 minutes before your scheduled appointment time. Bring
                  a valid ID and any relevant medical documents if applicable.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Go to Home
                </button>
                <button
                  onClick={() => navigate("/appointments")}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-green-600 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
                >
                  View My Appointments
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
