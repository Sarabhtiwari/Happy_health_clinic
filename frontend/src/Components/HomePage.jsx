import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./NavBar";
import useAuthStore from "../zustand/UseAuthStore";
import medicalDermatology from "../assets/medical_dermatology.png";
import cosmeticEnhancements from "../assets/cosmetic.png";
import laserTherapeutics from "../assets/laser.png";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 text-gray-900 font-sans selection:bg-gray-900 selection:text-white transition-colors duration-300">
      <Navbar />

      {/* --- EDITORIAL HERO SECTION --- */}
      <section className="pt-16 pb-16 px-6 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">
        <h4 className="text-gray-500 tracking-[0.3em] uppercase text-xs font-semibold mb-6">
          Advanced Dermatology in Nepal
        </h4>
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-tight text-gray-900 mb-8 max-w-4xl">
          Healthy Skin, <br className="hidden md:block" />
          <span className="italic text-gray-500">Confident You.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-12 font-light">
          Experience premium skincare with our state-of-the-art dermatology clinic and compassionate professionals.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button
            onClick={() => navigate("/contact")}
            className="px-10 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
          >
            Book Consultation
          </button>

          {/* CONTACT ICONS */}
          <div className="flex items-center gap-4">
            <a href="tel:+9779860831099" className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            </a>
            <a href="https://wa.me/9779860831099" target="_blank" rel="noopener noreferrer" className="w-12 h-12 flex items-center justify-center rounded-full border border-gray-300 text-gray-700 hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 21.031a9.07 9.07 0 0 1-4.63-1.267l-.333-.198-3.447.904.921-3.361-.217-.346a9.066 9.066 0 0 1-1.396-4.733c0-5.01 4.075-9.085 9.085-9.085 5.011 0 9.086 4.075 9.086 9.085 0 5.01-4.075 9.085-9.086 9.085zm0-19.82C6.155 1.211 1.375 5.991 1.375 11.877c0 1.875.49 3.704 1.422 5.317l-1.55 5.655 5.787-1.517a10.665 10.665 0 0 0 5.001 1.246c5.885 0 10.665-4.78 10.665-10.665 0-5.886-4.78-10.666-10.669-10.666zm5.836 14.88c-.26.732-1.516 1.408-2.106 1.472-.56.06-1.272.246-3.616-.728-2.831-1.176-4.646-4.08-4.785-4.27-.138-.19-1.144-1.522-1.144-2.905 0-1.383.717-2.062.972-2.342.254-.28.552-.35.735-.35.184 0 .367.004.526.012.164.008.384-.06.602.463.226.544.735 1.794.8 1.933.064.138.106.3.021.47-.085.168-.128.272-.255.42-.128.148-.27.316-.385.426-.128.116-.264.246-.112.51.152.264.676 1.12 1.448 1.81.996.89 1.83 1.173 2.096 1.295.264.122.42.106.576-.07.156-.176.676-.786.858-1.056.182-.27.364-.226.602-.138.238.088 1.506.71 1.764.84.258.13.43.194.492.3.062.106.062.614-.198 1.346z" /></svg>
            </a>
          </div>

          {isAuthenticated && isAdmin && (
            <button onClick={() => navigate("/admin")} className="px-6 py-4 border-2 border-gray-900 text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors">
              Admin Panel
            </button>
          )}
        </div>
      </section>

      {/* --- HERO IMAGE BANNER --- */}
      <section className="max-w-[96%] mx-auto relative mb-24">
        <img
          src="https://images.unsplash.com/photo-1612817288484-6f916006741a?auto=format&fit=crop&q=80&w=2000"
          alt="Clinic Interior"
          className="w-full h-[60vh] object-cover rounded-3xl"
        />

        {/* STATS OVERLAY OVER IMAGE */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-gray-900 p-8 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] grid grid-cols-2 md:grid-cols-4 gap-8 z-10">
          {[
            { label: "Years of Trust", value: "7+" },
            { label: "Expert Doctors", value: "7+" },
            { label: "Lives Touched", value: "25k+" },
            { label: "Availability", value: "7 Days" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <h3 className="text-3xl md:text-4xl font-serif text-white mb-2">{stat.value}</h3>
              <p className="text-xs uppercase tracking-widest text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- MINIMALIST SERVICES SECTION --- */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 border-b border-gray-200 pb-8">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Curated Treatments</h2>
            <p className="text-gray-600 font-light">Comprehensive solutions tailored to your unique skin biology.</p>
          </div>
          <button onClick={() => navigate("/services")} className="mt-6 md:mt-0 pb-1 border-b border-gray-900 text-gray-900 font-medium hover:text-gray-500 hover:border-gray-500 transition-colors">
            Explore All Services
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { 
              title: "Medical Dermatology", 
              desc: "Expert diagnosis and treatment for clinical skin conditions.",
              image: medicalDermatology
            },
            { 
              title: "Cosmetic Enhancements", 
              desc: "Refine your natural beauty with advanced aesthetic procedures.",
              image: cosmeticEnhancements
            },
            { 
              title: "Laser Therapeutics", 
              desc: "Precision light-based therapies for flawless skin texture.",
              image: laserTherapeutics
            }
          ].map((service, i) => (
            <div key={i} onClick={() => navigate("/services")} className="group cursor-pointer">
              <div className="aspect-square rounded-2xl mb-6 overflow-hidden relative bg-gray-100">
                <img 
                  src={service.image} 
                  alt={service.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-lg font-serif text-gray-900">0{i+1}</span>
                </div>
              </div>
              
              <h3 className="text-2xl font-serif text-gray-900 mb-3 group-hover:text-gray-600 transition-colors">{service.title}</h3>
              <p className="text-gray-500 font-light leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;