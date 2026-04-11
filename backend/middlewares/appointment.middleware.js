const mongoose = require("mongoose");
const { errorResponseBody } = require("../utils/responseBody");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");

const validateAppointmentRequest = async (req, res, next) => {
  const {
    appointmentDate,
    appointmentTime,
    // description is optional, not validated
  } = req.body;

  let errors = {};

  // Validate doctorId from route params
  if (!req.params.doctorId) {
    errors.doctorId = "Doctor ID is required in params";
  } else if (!mongoose.Types.ObjectId.isValid(req.params.doctorId)) {
    errors.doctorId = "Invalid Doctor ID";
  } else {
    const existingDoctor = await Doctor.findById(req.params.doctorId);
    if (!existingDoctor) {
      errors.doctorId = "Doctor not found";
    }
  }

  // Validate appointment date
  if (!appointmentDate) {
    errors.appointmentDate = "Appointment date is required";
  } else if (isNaN(Date.parse(appointmentDate))) {
    errors.appointmentDate = "Invalid date format";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    if (new Date(appointmentDate) < today) {
      errors.appointmentDate = "Appointment date cannot be in the past";
    }
  }

  // Validate appointment time
  if (!appointmentTime) {
    errors.appointmentTime = "Appointment time is required";
  } else if (!/^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(appointmentTime)) {
    errors.appointmentTime = "Invalid time format (use HH:MM or HH:MM:SS)";
  }

  // Validate combined date and time is not in the past
  if (appointmentDate && appointmentTime) {
    const appointmentDateTime = new Date(`${appointmentDate}T${appointmentTime}`);
    const now = new Date();
    // Allow appointments at least 1 hour from now
    now.setHours(now.getHours() + 1);
    if (appointmentDateTime < now) {
      errors.appointmentDateTime = "Appointment must be at least 1 hour from now";
    }
  }

  if (Object.keys(errors).length > 0) {
    errorResponseBody.err = errors;
    errorResponseBody.message = "Validation failed";
    return res.status(400).json(errorResponseBody);
  }

  next();
};

module.exports = {
  validateAppointmentRequest,
};
