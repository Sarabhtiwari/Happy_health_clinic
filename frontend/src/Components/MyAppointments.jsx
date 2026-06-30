import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import api from "../utils/api";

const MyAppointments = () => {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await api.get("/appointments");

      if (res.data.success) {
        setAppointments(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-28 px-4 sm:px-6 lg:px-10 max-w-7xl mx-auto">
        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-serif font-bold text-gray-900">
            My Appointments
          </h1>
          <p className="text-gray-500 mt-2">
            View all your booked consultations
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && appointments.length === 0 && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              No Appointments Found
            </h2>

            <p className="text-gray-500 mb-6">
              You haven’t booked any appointments yet.
            </p>

            <button
              onClick={() => navigate("/doctors")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
            >
              Book Appointment
            </button>
          </div>
        )}

        {/* Appointments */}
        {!loading && !error && appointments.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-10">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all"
              >
                {/* Doctor */}
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">
                      Doctor
                    </p>

                    <h2 className="text-2xl font-bold text-gray-900">
                      Dr.{" "}
                      {appointment.doctor?.user?.name || "Unknown"}
                    </h2>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-xs font-bold ${
                      appointment.paymentStatus === "PAID"
                        ? "bg-green-100 text-green-700"
                        : appointment.paymentStatus === "FAILED"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {appointment.paymentStatus}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500">
                      Appointment Date
                    </span>

                    <span className="font-semibold text-gray-800">
                      {new Date(
                        appointment.dateOfAppointment
                      ).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-500">
                      Appointment ID
                    </span>

                    <span className="font-mono text-gray-700 text-xs">
                      {appointment._id}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Payment
                    </span>

                    <span className="font-semibold text-gray-800">
                      {appointment.payment ? "Completed" : "Pending"}
                    </span>
                  </div>
                </div>

                {/* Button */}
                {/* {appointment.paymentStatus !== "PAID" && (
                  <button
                    onClick={() =>
                      navigate(`/payment/${appointment._id}`)
                    }
                    className="mt-6 w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-semibold"
                  >
                    Complete Payment
                  </button>
                )} */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;