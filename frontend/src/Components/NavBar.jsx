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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      setIsMenuOpen(false);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Doctors", path: "/doctors" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-[100] transition-all duration-300 ${
          isScrolled || isMenuOpen
            ? "bg-white dark:bg-[#0A111E] shadow-md border-b border-stone-200 dark:border-stone-800 py-3"
            : "bg-white/90 dark:bg-[#0A111E]/90 backdrop-blur-md border-b border-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
          
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer z-50 group"
            onClick={() => {
              navigate("/");
              setIsMenuOpen(false);
            }}
          >
            <div className="w-11 h-11 bg-gradient-to-br from-stone-800 to-stone-950 dark:from-stone-100 dark:to-stone-300 rounded-xl flex items-center justify-center text-white dark:text-[#0A111E] font-serif text-2xl font-bold shadow-md group-hover:shadow-lg group-hover:-translate-y-0.5 transition-all duration-300">
              H
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-xl font-serif font-bold text-stone-900 dark:text-white tracking-wide leading-tight">
                Happy Health
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-stone-500 dark:text-stone-400 font-bold mt-0.5">
                Skin Hair Laser Clinic
              </span>
            </div>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className={`relative px-1 py-2 text-sm font-semibold tracking-wide transition-colors group ${
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

          {/* ACTIONS */}
          <div className="flex items-center gap-4 z-50">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 dark:text-stone-400 dark:hover:text-white dark:hover:bg-white/10 transition-all duration-300"
              aria-label="Toggle Theme"
            >
              <span className="text-lg leading-none block">{isDarkMode ? "☼" : "☾"}</span>
            </button>

            <div className="hidden md:flex items-center gap-4 border-l border-stone-200 dark:border-white/10 pl-4">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => navigate("/my-appointments")}
                    className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    Appointments
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-5 py-2 rounded-full border border-stone-200 dark:border-stone-700 hover:border-stone-900 dark:hover:border-white text-stone-900 dark:text-white text-sm font-semibold hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-[#0A111E] transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-sm font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate("/signup")}
                    className="px-6 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-[#0A111E] text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Book Now
                  </button>
                </>
              )}
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              className="md:hidden p-2 -mr-2 text-stone-900 dark:text-white rounded-full hover:bg-stone-100 dark:hover:bg-white/10 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[90] bg-white dark:bg-[#0A111E] pt-28 px-6 md:hidden flex flex-col animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => { navigate(link.path); setIsMenuOpen(false); }}
                className={`text-left text-2xl font-serif py-4 border-b border-stone-200 dark:border-stone-800 transition-all ${
                  location.pathname === link.path
                    ? "text-stone-900 dark:text-white pl-2 border-stone-900 dark:border-white"
                    : "text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white hover:pl-2"
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>
          <div className="mt-auto pb-12 pt-6 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <button onClick={() => { navigate("/my-appointments"); setIsMenuOpen(false); }} className="w-full py-4 bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-900 dark:text-white transition-colors rounded-2xl font-semibold">
                  My Appointments
                </button>
                <button onClick={handleLogout} className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors rounded-2xl font-semibold">
                  Logout
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate("/signup"); setIsMenuOpen(false); }} className="w-full py-4 bg-stone-900 dark:bg-white text-white dark:text-[#0A111E] rounded-2xl font-semibold shadow-lg active:scale-[0.98] transition-transform">
                  Sign Up / Book Now
                </button>
                <button onClick={() => { navigate("/login"); setIsMenuOpen(false); }} className="w-full py-4 border-2 border-stone-200 dark:border-white/20 text-stone-900 dark:text-white rounded-2xl font-semibold hover:border-stone-900 dark:hover:border-white transition-colors active:scale-[0.98]">
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;