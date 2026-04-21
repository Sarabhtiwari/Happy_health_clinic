import React, { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import formatError from "../utils/errorFormatter";

const DoctorsList = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("/doctors");
        setDoctors(response.data.data);
        setLoading(false);
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch doctor details";
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleBookAppointment = async (doctorId) => {
    try {
      await api.get("/auth/me");
      navigate(`/book-appointment/${doctorId}`);
    } catch {
      navigate("/login", { state: { from: `/book-appointment/${doctorId}` } });
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-serif text-blue-600 animate-pulse">Loading our specialists...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl font-medium text-red-600">Error: {formatError(error)}</div>
      </div>
    );

  return (
    <div className="py-24 bg-gray-50 min-h-screen">
        <Navbar />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- HEADER --- */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            Meet Our Specialists
          </h1>
          <p className="text-xl text-gray-500 font-light">
            A team of dedicated professionals committed to your skin health and wellness.
          </p>
        </div>

        {/* --- DOCTORS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {doctors.map((doctor) => (
            <div 
              key={doctor._id}
              className="glass rounded-2xl p-6 flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 relative overflow-hidden bg-white/70 backdrop-blur-md"
            >
              {/* Decorative Background Gradient on Hover */}
              <div className="absolute top-0 left-0 w-full h-24 bg-linear-to-b from-blue-50 to-transparent -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

              {/* Doctor Image */}
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg group-hover:border-blue-100 transition-colors">
                <img 
                  alt={doctor.user?.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  loading="lazy" 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.user?.name || "Doctor")}&background=0D8ABC&color=fff&size=128`} 
                />
              </div>

              {/* Info */}
              <h3 className="text-xl font-serif font-bold text-gray-900 mb-1">
                Dr. {doctor.user?.name}
              </h3>
              <p className="text-blue-600 font-medium text-sm mb-2">
                {doctor.specialization || "Dermatologist"}
              </p>

              <div className="flex gap-2 mb-4 justify-center flex-wrap">
                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  {doctor.qualification}
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                  ₹{doctor.fees} Fee
                </span>
              </div>

              <p className="text-gray-500 text-sm line-clamp-3 mb-6 font-light leading-relaxed">
                Dedicated specialist providing expert care in {doctor.specialization || "clinical dermatology"} with a personalized approach for every patient.
              </p>

              {/* Action Button */}
              <button 
                onClick={() => handleBookAppointment(doctor._id)}
                className="mt-auto w-full py-3 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-blue-100"
              >
                Book Appointment
              </button>

              {/* Social Icons (Optional) */}
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100 w-full justify-center opacity-40 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer">
                  <svg stroke="currentColor" fill="currentColor" viewBox="0 0 448 512" height="14" width="14"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"></path></svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorsList;