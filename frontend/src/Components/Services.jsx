import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "./NavBar";
import api from "../utils/api";
import useAuthStore from "../zustand/UseAuthStore";

const Services = () => {
  const { isAuthenticated } = useAuthStore();

  const [servicesList, setServicesList] = useState([]);
  const [bookedMap, setBookedMap] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // ── FETCH SERVICES (always, on mount) ──
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servRes = await api.get("/services");
        setServicesList(servRes.data.data || []);
      } catch (error) {
        console.error("Services Fetch Error:", error);
      } finally {
        setLoadingData(false);
      }
    };
    fetchServices();
  }, []); // Runs only once on mount — services are public

  // ── FETCH BOOKINGS (only when isAuthenticated becomes true) ──
  useEffect(() => {
    if (!isAuthenticated) {
      // User logged out or not yet verified — clear the map
      setBookedMap({});
      return;
    }

    const fetchBookings = async () => {
      try {
        const bookRes = await api.get("/service-appointments/me");
        const appointments = bookRes.data.data || [];

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize to midnight for fair comparison

        const map = {};
        appointments.forEach((appt) => {
          const todayStr = new Date().toLocaleDateString("en-CA"); 
          if (appt.date >= todayStr) {
          
            const serviceId = appt.service?._id || appt.service;
            map[serviceId] = appt._id;
          }
        });

        setBookedMap(map);
      } catch (error) {
        console.error("Bookings Fetch Error:", error);
      }
    };

    fetchBookings();
  }, [isAuthenticated]); // Re-runs when auth state settles to true after reload

  const handleBookClick = (service) => {
    if (!isAuthenticated) return alert("Please login to book a service!");
    setSelectedService(service);
    setModalOpen(true);
  };

  const confirmBooking = async () => {
    if (!selectedDate) return alert("Please select a date!");
    setBookingLoading(true);
    try {
      const res = await api.post("/service-appointments", {
        serviceId: selectedService._id,
        date: selectedDate,
      });
      setBookedMap((prev) => ({
        ...prev,
        [selectedService._id]: res.data.data._id,
      }));
      setModalOpen(false);
      setSelectedDate("");
      setSelectedService(null);
    } catch (error) {
      alert("Booking failed: " + (error.response?.data?.err || error.message));
    } finally {
      setBookingLoading(false);
    }
  };

  const cancelBooking = async (serviceId, appointmentId) => {
    try {
      await api.delete(`/service-appointments/${appointmentId}`);
      setBookedMap((prev) => {
        const newState = { ...prev };
        delete newState[serviceId];
        return newState;
      });
    } catch (error) {
      alert(
        "Cancellation failed: " + (error.response?.data?.err || error.message),
      );
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (loadingData) {
    return (
      <div className="min-h-screen pt-32 text-center text-gray-500 font-bold text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 relative">
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-bold mb-16">
          Our <span className="text-blue-600">Clinical Services</span>
        </h1>
        <div className="flex flex-col gap-16">
          {servicesList.map((service) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-col lg:flex-row gap-10 bg-white p-8 rounded-3xl shadow"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full lg:w-1/2 h-[300px] object-cover rounded-2xl"
              />
              <div className="space-y-4 flex flex-col justify-between w-full">
                <div>
                  <h2 className="text-2xl font-bold">{service.title}</h2>
                  <p className="text-blue-600 font-bold text-xl mt-1">
                    NPR {service.priceRange}
                  </p>
                  <p className="mt-2 text-gray-800">{service.desc}</p>
                  <p className="text-gray-500 text-sm mt-2 leading-relaxed">
                    {service.details}
                  </p>
                </div>
                <div className="mt-4">
                  {bookedMap[service._id] ? (
                    <div className="flex gap-3 flex-wrap">
                      <button className="bg-green-100 text-green-800 px-6 py-3 rounded-xl font-bold cursor-default flex items-center gap-2">
                        <span>✅</span> Booked
                      </button>
                      <button
                        onClick={() =>
                          cancelBooking(service._id, bookedMap[service._id])
                        }
                        className="bg-white text-red-600 border-2 border-red-200 px-6 py-3 rounded-xl font-bold hover:bg-red-50 hover:border-red-300 transition-colors"
                      >
                        Cancel Appointment
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleBookClick(service)}
                      className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md"
                    >
                      Book This Service
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Book Service
            </h2>
            <p className="text-blue-600 font-semibold mb-6">
              {selectedService?.title}
            </p>
            <label className="block font-bold mb-2 text-sm text-gray-700">
              Select Appointment Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={today}
              className="w-full border-2 border-gray-200 rounded-xl p-3 mb-8 focus:border-blue-500 focus:ring-0 outline-none text-gray-700"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setSelectedDate("");
                }}
                className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                disabled={bookingLoading}
                className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold disabled:bg-blue-300 transition-colors shadow-md"
              >
                {bookingLoading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
