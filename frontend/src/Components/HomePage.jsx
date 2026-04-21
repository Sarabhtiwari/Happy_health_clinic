import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";

function HomePage() {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Doctors", path: "/doctors" },
    { name: "Membership", path: "/membership" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
        <Navbar />
      
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-gray-50 px-4">
        <div className="container mx-auto px-2 lg:px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-2xl text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 leading-tight">
              Healthy Skin, <br />
              <span className="text-blue-600">Confident You</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-10 leading-relaxed">
              Experience premium skincare with our state-of-the-art dermatology
              clinic and compassionate professionals in Nepal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate("/contact")}
                className="px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 hover:scale-105 transition-all shadow-xl shadow-blue-200"
              >
                Book Consultation
              </button>
              <button
                onClick={() => navigate("/services")}
                className="px-8 py-4 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900 font-medium rounded-xl hover:bg-white hover:scale-105 transition-all"
              >
                Our Treatments
              </button>
            </div>
          </div>

          <div className="hidden md:block relative">
            <img
              src="https://images.unsplash.com/photo-1638202993928-7267aad84c31?auto=format&fit=crop&q=80&w=1200"
              alt="Clinic"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* --- QUICK STATS --- */}
      <section className="relative -mt-16 z-30 container mx-auto px-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-6 sm:p-8 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {[
            { label: "Years Experience", value: "15+" },
            { label: "Skin Specialists", value: "12+" },
            { label: "Happy Patients", value: "25k+" },
            { label: "Open Weekly", value: "7 Days" },
          ].map((stat, i) => (
            <div
              key={i}
              className="text-center border-r last:border-0 border-gray-100 sm:px-2"
            >
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-blue-600 mb-1">
                {stat.value}
              </h3>
              <p className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest font-semibold">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- SERVICES PREVIEW --- */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mb-12 gap-4 text-center sm:text-left">
            <div>
              <h4 className="text-blue-600 font-semibold tracking-widest uppercase text-xs mb-2">
                Complete Skincare
              </h4>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900">
                Our Key Services
              </h2>
            </div>
            <button
              onClick={() => navigate("/services")}
              className="text-blue-600 font-medium hover:underline transition-all cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["Medical Dermatology", "Cosmetic Care", "Laser Treatment"].map(
              (service, i) => (
                <div
                  key={i}
                  onClick={() => navigate("/services")}
                  className="p-8 rounded-2xl border border-gray-100 bg-gray-50/50 hover:-translate-y-2 hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-3">
                    {service}
                  </h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Expert specialized care tailored to your specific skin
                    needs.
                  </p>
                  <button
                    className="text-blue-600 text-sm font-bold group-hover:gap-2 flex items-center transition-all cursor-pointer"
                  >
                    Learn More
                  </button>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;