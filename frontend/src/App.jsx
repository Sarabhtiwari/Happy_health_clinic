import { useState } from "react";

import "./App.css";
import HomePage from "./Components/HomePage";
import DoctorsList from "./Components/DoctorsList";
import SignUp from "./Components/SignUp";
import Services from "./Components/Services";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Contact from "./Components/Contact";
import PaymentPage from "./Components/PaymentPage";
import PaymentSuccess from "./Components/PaymentSuccess";
import PaymentFailed from "./Components/PaymentFailed";
import AppointmentBooking from "./Components/AppointmentBooking";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/doctors" element={<DoctorsList />} />
          <Route path="/book-appointment/:doctorId" element={<AppointmentBooking />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/payment/:appointmentId" element={<PaymentPage />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFailed />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
