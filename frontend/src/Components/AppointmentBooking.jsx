import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import formatError from "../utils/errorFormatter";

const AppointmentBooking = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const bookingDoneRef = useRef(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/hhc/api/v1/doctors/${doctorId}`
        );
        setDoctor(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.err || err.message || "Failed to fetch doctor details");
        setLoading(false);
      }
    };
    if (doctorId) fetchDoctor();
  }, [doctorId]);

  // Block refresh after booking is created but before redirect
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (bookingDoneRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const validateForm = () => {
    if (!formData.appointmentDate) {
      setValidationError("Please select an appointment date");
      return false;
    }
    const selectedDate = new Date(formData.appointmentDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setValidationError("Appointment date cannot be in the past");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("You must be logged in to book an appointment");
        setSubmitting(false);
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/hhc/api/v1/doctors/${doctorId}/appointments`,
        {
          appointmentDate: formData.appointmentDate,
          description: formData.description,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const appointmentId = response.data.data._id;
      bookingDoneRef.current = true;
      navigate(`/payment/${appointmentId}`);
    } catch (err) {
      setError(err.response?.data?.err || err.message || "Failed to create appointment");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-serif text-blue-600 animate-pulse">
          Loading booking details...
        </div>
      </div>
    );
  }

  if (error && !doctor) {
    return (
      <div className="py-24 bg-gray-50 min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
              <h2 className="text-2xl font-serif font-bold text-red-600 mb-2">Error</h2>
              <p className="text-red-700 mb-6">{formatError(error)}</p>
              <button
                onClick={() => navigate("/doctors")}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Back to Doctors
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getTodayDate = () => new Date().toISOString().split("T")[0];

  return (
    <div className="py-24 bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
              Book an Appointment
            </h1>
            <p className="text-lg text-gray-600">
              Schedule your consultation with the doctor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Doctor Profile Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 h-fit">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Doctor Profile
              </h2>
              <div className="text-center mb-6">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 border-4 border-blue-100 shadow-lg">
                  <img
                    alt={doctor?.user?.name}
                    className="w-full h-full object-cover"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                      doctor?.user?.name || "Doctor"
                    )}&background=0D8ABC&color=fff&size=128`}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="py-3 border-b border-gray-200">
                  <p className="text-gray-600 font-medium mb-1">Name</p>
                  <p className="text-gray-900 font-semibold">
                    Dr. {doctor?.user?.name}
                  </p>
                </div>
                <div className="py-3 border-b border-gray-200">
                  <p className="text-gray-600 font-medium mb-1">Specialization</p>
                  <p className="text-gray-900 font-semibold">
                    {doctor?.specialization || "N/A"}
                  </p>
                </div>
                <div className="py-3 border-b border-gray-200">
                  <p className="text-gray-600 font-medium mb-1">Qualification</p>
                  <p className="text-gray-900 font-semibold">
                    {doctor?.qualification || "N/A"}
                  </p>
                </div>
                <div className="py-3 border-b border-gray-200">
                  <p className="text-gray-600 font-medium mb-1">Available Days</p>
                  <p className="text-gray-900 font-semibold">
                    {doctor?.availableDays?.join(", ") || "MON–FRI"}
                  </p>
                </div>
                {/* Working hours shown as info only — user doesn't pick time */}
                <div className="py-3 border-b border-gray-200">
                  <p className="text-gray-600 font-medium mb-1">Working Hours</p>
                  <p className="text-gray-900 font-semibold">
                    {doctor?.workingHours?.start || "09:00"} –{" "}
                    {doctor?.workingHours?.end || "18:00"}
                  </p>
                </div>
                <div className="py-3 bg-blue-50 px-4 rounded-lg">
                  <p className="text-gray-600 font-medium mb-1">Consultation Fee</p>
                  <p className="text-2xl font-serif font-bold text-blue-600">
                    NPR {doctor?.fees}
                  </p>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Appointment Details
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {validationError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <p className="text-red-700 font-medium">{validationError}</p>
                  </div>
                )}
                {error && !validationError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                    <p className="text-red-700 font-medium">{formatError(error)}</p>
                  </div>
                )}

                {/* Date only — no time picker */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleInputChange}
                    min={getTodayDate()}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Doctor is available: {doctor?.availableDays?.join(", ")}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Reason for Appointment
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your symptoms or reason for visit..."
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This helps the doctor prepare for your visit
                  </p>
                </div>

                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Booking Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consultation Fee:</span>
                      <span className="font-semibold text-gray-900">
                        NPR {doctor?.fees}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Processing:</span>
                      <span className="font-semibold text-gray-900">Free</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2 mt-2 flex justify-between">
                      <span className="font-semibold text-gray-900">Total:</span>
                      <span className="font-bold text-blue-600 text-lg">
                        NPR {doctor?.fees}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
                  <p className="text-sm text-yellow-800">
                    <span className="font-semibold">Note:</span> After booking,
                    you'll be redirected to payment. You have 5 minutes to
                    complete payment or the appointment will be cancelled.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => navigate("/doctors")}
                    disabled={submitting}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className={`flex-1 px-6 py-3 font-semibold rounded-lg text-white transition-all duration-300 ${
                      submitting
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:scale-105"
                    }`}
                  >
                    {submitting ? (
                      <span className="flex items-center justify-center">
                        <span className="animate-spin inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                        Booking...
                      </span>
                    ) : (
                      "Proceed to Payment"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentBooking;