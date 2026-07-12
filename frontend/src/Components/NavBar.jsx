 import React, { useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";

import api from "../utils/api";

import useAuthStore from "../zustand/UseAuthStore";



const Navbar = () => {

  const navigate = useNavigate();

  const location = useLocation();

  const { user, clearAuth } = useAuthStore();

  const isLoggedIn = !!user;

  const [isScrolled, setIsScrolled] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);



  useEffect(() => {

    // Listen to window scroll to trigger the background change

    const handleScroll = () => setIsScrolled(window.scrollY > 20);

    window.addEventListener("scroll", handleScroll);



    const storedTheme = localStorage.getItem("theme");

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const startDark = storedTheme === "dark" || (!storedTheme && prefersDark);

    setIsDarkMode(startDark);

    document.documentElement.classList.toggle("dark", startDark);



    return () => window.removeEventListener("scroll", handleScroll);

  }, [location.pathname]);



  const toggleTheme = () => {

    setIsDarkMode((prev) => {

      const next = !prev;

      localStorage.setItem("theme", next ? "dark" : "light");

      document.documentElement.classList.toggle("dark", next);

      return next;

    });

  };



  const handleLogout = async () => {

    try {

      await api.post("/auth/signout");

    } catch (err) {

      console.warn("Logout failed:", err);

    } finally {

      clearAuth();

      navigate("/");

    }

  };



  const navLinks = [

    { name: "Home", path: "/" },

    { name: "Services", path: "/services" },

    { name: "Doctors", path: "/doctors" },

    { name: "Contact", path: "/contact" },

  ];



  return (

    <header

      className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${

        isScrolled

          ? "bg-white dark:bg-[#0A111E] shadow-md border-b border-stone-200 dark:border-stone-800 py-2 md:py-3"

          : "bg-white/90 dark:bg-[#0A111E]/90 backdrop-blur-md border-b border-transparent py-3 md:py-5"

      }`}

    >

      {/* flex-wrap allows the nav items to drop to a second row on mobile */}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-wrap md:flex-nowrap items-center justify-between gap-y-3">

       

        {/* LOGO */}

        <div

          className="flex items-center gap-2 md:gap-3 cursor-pointer z-50 group"

          onClick={() => navigate("/")}

        >

          <img

            src="https://res.cloudinary.com/dz3jyr4uy/image/upload/f_auto,q_auto/hhc_1_i4laq5"

            alt="Happy Health Clinic Logo"

            className="w-9 h-9 md:w-11 md:h-11 object-contain group-hover:-translate-y-0.5 transition-all duration-300"

          />

          <div className="flex flex-col justify-center">

            <span className="text-lg md:text-xl font-serif font-bold text-stone-900 dark:text-white tracking-wide leading-tight">

              Happy Health

            </span>

            <span className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 font-bold mt-0.5">

              Skin Hair Laser Clinic

            </span>

          </div>

        </div>



        {/* DESKTOP & MOBILE NAV LINKS */}

        {/* order-3 moves this to the bottom on mobile, w-full ensures it takes the whole width */}

        <nav className="order-3 md:order-none w-full md:w-auto flex items-center justify-center md:justify-start gap-4 md:gap-8 overflow-x-auto pb-1 md:pb-0">

          {navLinks.map((link) => (

            <button

              key={link.name}

              onClick={() => navigate(link.path)}

              className={`relative px-1 py-1 md:py-2 text-sm font-semibold tracking-wide transition-colors group whitespace-nowrap ${

                location.pathname === link.path

                  ? "text-stone-900 dark:text-white"

                  : "text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"

              }`}

            >

              {link.name}

              {/* Animated Underline */}

              <span

                className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full bg-stone-900 dark:bg-white transition-transform duration-300 origin-left ${

                  location.pathname === link.path

                    ? "scale-x-100"

                    : "scale-x-0 group-hover:scale-x-100"

                }`}

              />

            </button>

          ))}

        </nav>



        {/* ACTIONS (Theme Toggle & Auth Buttons) */}

        <div className="flex items-center gap-2 md:gap-4 z-50">

          {/* Theme Toggle */}

          <button

            onClick={toggleTheme}

            className="p-1.5 md:p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300"

            aria-label="Toggle Theme"

          >

            <span className="text-lg md:text-xl leading-none block">{isDarkMode ? "☼" : "☾"}</span>

          </button>



          <div className="flex items-center gap-3 border-l border-stone-200 dark:border-white/10 pl-2 md:pl-4">

            {isLoggedIn ? (

              <>

                <button

                  onClick={() => navigate("/my-appointments")}

                  className="hidden sm:block text-xs md:text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"

                >

                  Appointments

                </button>

                <button

                  onClick={handleLogout}

                  className="px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-stone-200 dark:border-stone-700 hover:border-stone-900 dark:hover:border-white text-stone-900 dark:text-white text-xs md:text-sm font-semibold hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-[#0A111E] transition-all duration-300 shadow-sm hover:shadow-md"

                >

                  Logout

                </button>

              </>

            ) : (

              <>

                <button

                  onClick={() => navigate("/login")}

                  className="hidden sm:block text-xs md:text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"

                >

                  Login

                </button>

                <button

                  onClick={() => navigate("/signup")}

                  className="px-4 py-1.5 md:px-6 md:py-2.5 bg-stone-900 dark:bg-white text-white dark:text-[#0A111E] text-xs md:text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all duration-300 whitespace-nowrap"

                >

                  Book Now

                </button>

              </>

            )}

          </div>

        </div>

      </div>

    </header>

  );

};



export default Navbar; 

