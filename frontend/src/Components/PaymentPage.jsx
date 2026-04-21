import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import Navbar from "./NavBar";
import formatError from "../utils/errorFormatter";

const PaymentPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initiatingPayment, setInitiatingPayment] = useState(false);
  const redirectedToKhaltiRef = useRef(false);

  // Cancel appointment and navigate away
  const cancelAndCleanup = useCallback(
    async (reason = "back") => {
      if (redirectedToKhaltiRef.current) return;
      try {
        if (appointmentId) {
          await api.delete(`/appointments/${appointmentId}`);
        }
      } catch (err) {
        console.warn("Cleanup error (ignorable):", err.message);
      }
      navigate("/doctors", {
        state: { message: "Appointment cancelled. Please book a new one." },
      });
    },
    [appointmentId, navigate]
  );

  // Intercept browser back button → cancel appointment
  useEffect(() => {
    if (!appointment) return;
    window.history.pushState({ paymentPage: true }, "");
    const handlePopState = () => cancelAndCleanup("back");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [appointment, cancelAndCleanup]);

  // Warn user before closing/refreshing the tab
  useEffect(() => {
    if (!appointment || redirectedToKhaltiRef.current) return;
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [appointment]);

  // Fetch appointment details on mount
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await api.get(`/appointments/${appointmentId}`);
        setAppointment(response.data.data);
      } catch (err) {
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          setError("You must be logged in to proceed with payment");
          navigate("/login");
        } else {
          setError(
            err.response?.data?.err ||
              err.message ||
              "Failed to fetch appointment details"
          );
        }
      } finally {
        setLoading(false);
      }
    };
    if (appointmentId) fetchAppointment();
  }, [appointmentId, navigate]);

  const handleInitiatePayment = async () => {
    setInitiatingPayment(true);
    setError(null);

    // Pre-payment slot availability check
    try {
      const doctorId = appointment?.doctor?._id;
      if (doctorId) {
        await api.get(`/doctors/${doctorId}/appointments`);
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 409 || status === 404) {
        setError(
          err.response?.data?.err ||
            "This slot is no longer available. Please book a new appointment."
        );
        setInitiatingPayment(false);
        return;
      }
      console.warn("Slot check warning (proceeding):", err.message);
    }

    try {
      const response = await api.post(`/payment/initiate/${appointmentId}`, {});
      redirectedToKhaltiRef.current = true;
      window.location.href = response.data.data.paymentUrl;
    } catch (err) {
      setError(
        err.response?.data?.err || err.message || "Failed to initiate payment"
      );
      setInitiatingPayment(false);
      redirectedToKhaltiRef.current = false;
    }
  };

  // ── Render states ────────────────────────────────────────────────

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

  if (appointment?.paymentStatus === "PAID") {
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

  // ── Main payment UI ──────────────────────────────────────────────

  return (
    <div className="py-24 bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
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

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">Date:</span>
                    <span className="text-gray-900 font-semibold">
                      {appointment?.dateOfAppointment
                        ? new Date(
                            appointment.dateOfAppointment
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600 font-medium">
                      Doctor's Hours:
                    </span>
                    <span className="text-gray-900 font-semibold">
                      {appointment?.doctor?.workingHours?.start || "09:00"} –{" "}
                      {appointment?.doctor?.workingHours?.end || "18:00"}
                    </span>
                  </div>

                  {appointment?.description && (
                    <div className="py-3 border-b border-gray-200">
                      <span className="text-gray-600 font-medium block mb-2">
                        Description:
                      </span>
                      <span className="text-gray-900 font-semibold">
                        {appointment.description}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center py-3 bg-green-50 px-4 rounded-lg">
                    <span className="text-gray-600 font-medium">
                      Payment Status:
                    </span>
                    <span
                      className={`inline-flex px-3 py-1 rounded-full font-semibold text-sm ${
                        appointment?.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : appointment?.paymentStatus === "FAILED"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {appointment?.paymentStatus || "PENDING"}
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

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
                  <p className="text-red-700 font-medium">{formatError(error)}</p>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">
                    Consultation Fee:
                  </span>
                  <span className="text-gray-900 font-semibold">
                    NPR {appointment?.doctor?.fees || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">
                    Processing Fee:
                  </span>
                  <span className="text-gray-900 font-semibold">Free</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg border-2 border-blue-200">
                  <span className="font-semibold text-gray-900 text-lg">
                    Total Amount:
                  </span>
                  <span className="font-bold text-blue-600 text-xl">
                    NPR {appointment?.doctor?.fees || 0}
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg mb-8">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">💳</span>
                  <h3 className="font-semibold text-yellow-800">
                    Secure Payment via Khalti
                  </h3>
                </div>
                <p className="text-sm text-yellow-700 mb-3">
                  You'll be redirected to Khalti to complete payment. Do not
                  press back during payment.
                </p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Multiple payment options (Mobile, Bank, Cards)</li>
                  <li>• 256-bit SSL encryption</li>
                  <li>• No additional charges</li>
                </ul>
              </div>

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
                      Verifying & Connecting to Khalti...
                    </span>
                  ) : (
                    `Pay NPR ${appointment?.doctor?.fees || 0} Now`
                  )}
                </button>
                <p className="text-center text-sm text-gray-500">
                  Press your browser's back button to cancel this appointment.
                </p>
              </div>

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