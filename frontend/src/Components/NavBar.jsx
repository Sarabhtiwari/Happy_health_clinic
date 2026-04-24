import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const startDark = storedTheme === "dark" || (!storedTheme && prefersDark);
    setIsDarkMode(startDark);
    document.documentElement.classList.toggle("dark", startDark);

    const fetchAuthStatus = async () => {
      try {
        const res = await api.get("/auth/me");

        if (res.data?.success) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    fetchAuthStatus();
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
      console.warn(err);
    }
    setIsLoggedIn(false);
    navigate("/");
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Doctors", path: "/doctors" },
    { name: "Lab", path: "/lab" },
    { name: "Contact", path: "/contact" },
  ];

  const activeClass = "text-blue-600 border-b-2 border-blue-600";
  const idleClass = "text-gray-600 hover:text-blue-600 transition-colors";

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? "bg-white shadow-sm py-3" : "bg-transparent py-5"}`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer z-50"
          onClick={() => {
            navigate("/");
            setIsMenuOpen(false);
          }}
        >
          <span className="text-2xl font-serif font-bold text-blue-600">
            Happy Health
          </span>
          <span className="hidden sm:inline-block text-sm text-gray-400 border-l border-gray-200 pl-3">
            Clinic
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={
                location.pathname === link.path ? activeClass : idleClass
              }
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Auth & Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="hidden md:inline-flex p-2 rounded-full bg-slate-100 text-slate-900 hover:bg-slate-200 transition-all dark:bg-slate-800 dark:text-slate-100"
          >
            {isDarkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="currentColor"
              >
                <path d="M21.752 15.002A9.718 9.718 0 0112 21.75 9.75 9.75 0 1121.75 12c0 1.148-.206 2.25-.598 3.252z" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="currentColor"
              >
                <path d="M12 4.75a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V5.5A.75.75 0 0112 4.75zm0 12.5a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5a.75.75 0 01.75-.75zm7.25-6a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM6 12.5a.75.75 0 01-.75.75H3.75a.75.75 0 010-1.5h1.5A.75.75 0 016 12.5zm10.72-4.78a.75.75 0 01.53 1.28l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 01.53-.16zm-9.94 9.94a.75.75 0 01.53 1.28l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 01.53-.16zM17.28 17.28a.75.75 0 01-1.06 0l-1.06-1.06a.75.75 0 111.06-1.06l1.06 1.06a.75.75 0 010 1.06zM7.78 6.78a.75.75 0 01-1.06 0L5.66 5.72a.75.75 0 111.06-1.06l1.06 1.06a.75.75 0 010 1.06zM12 8.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z" />
              </svg>
            )}
          </button>

          <div className="hidden md:flex gap-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-red-50 text-red-600 rounded-full text-sm font-semibold hover:bg-red-100 transition-all"
              >
                Logout
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-5 py-2 text-gray-600 text-sm font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          <button
            className="md:hidden p-2 text-gray-600 z-50"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 flex flex-col p-6 gap-4 shadow-xl dark:bg-slate-950 dark:border-slate-800">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                navigate(link.path);
                setIsMenuOpen(false);
              }}
              className="text-left text-lg font-medium text-gray-700 dark:text-slate-100"
            >
              {link.name}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            className="w-full py-3 bg-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-200 transition-all dark:bg-slate-800 dark:text-slate-100"
          >
            {isDarkMode ? "Switch to Light" : "Switch to Dark"}
          </button>
          <hr className="border-gray-200 dark:border-slate-700" />
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold dark:bg-red-900 dark:text-red-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/signup");
                setIsMenuOpen(false);
              }}
              className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
            >
              Sign Up
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
