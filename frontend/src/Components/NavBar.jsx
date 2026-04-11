import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    const token = localStorage.getItem("authToken");
    if (token) setIsLoggedIn(true);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
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
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled || isMenuOpen ? "bg-white shadow-sm py-3" : "bg-transparent py-5"}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer z-50" onClick={() => { navigate("/"); setIsMenuOpen(false); }}>
          <span className="text-2xl font-serif font-bold text-blue-600">Happy Health</span>
          <span className="hidden sm:inline-block text-sm text-gray-400 border-l border-gray-200 pl-3">Clinic</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <button 
              key={link.name} 
              onClick={() => navigate(link.path)}
              className={location.pathname === link.path ? activeClass : idleClass}
            >
              {link.name}
            </button>
          ))}
        </nav>

        {/* Auth & Hamburger */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-3">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-5 py-2 bg-red-50 text-red-600 rounded-full text-sm font-semibold hover:bg-red-100 transition-all">Logout</button>
            ) : (
              <>
                <button onClick={() => navigate("/login")} className="px-5 py-2 text-gray-600 text-sm font-semibold">Login</button>
                <button onClick={() => navigate("/signup")} className="px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all">Sign Up</button>
              </>
            )}
          </div>
          
          <button className="md:hidden p-2 text-gray-600 z-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 flex flex-col p-6 gap-4 shadow-xl">
          {navLinks.map((link) => (
            <button key={link.name} onClick={() => { navigate(link.path); setIsMenuOpen(false); }} className="text-left text-lg font-medium text-gray-700">
              {link.name}
            </button>
          ))}
          <hr />
          {isLoggedIn ? (
            <button onClick={handleLogout} className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-bold">Logout</button>
          ) : (
            <button onClick={() => { navigate("/signup"); setIsMenuOpen(false); }} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold">Sign Up</button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;