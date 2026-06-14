const mongoose = require("mongoose");
const { errorResponseBody } = require("../utils/responseBody");
const Doctor = require("../models/doctor.model");
const Appointment = require("../models/appointment.model");

const DAY_MAP = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const validateAppointmentRequest = async (req, res, next) => {
  const { appointmentDate } = req.body;
  let errors = {};

  if (!req.params.doctorId) {
    errors.doctorId = "Doctor ID is required in params";
  } else if (!mongoose.Types.ObjectId.isValid(req.params.doctorId)) {
    errors.doctorId = "Invalid Doctor ID";
  } else {
    const existingDoctor = await Doctor.findById(req.params.doctorId);
    if (!existingDoctor) {
      errors.doctorId = "Doctor not found";
    } else {
      if (appointmentDate) {
        const selectedDay = DAY_MAP[new Date(appointmentDate).getDay()];
        if (!existingDoctor.availableDays.includes(selectedDay)) {
          errors.appointmentDate = `Doctor is not available on ${selectedDay}. Available: ${existingDoctor.availableDays.join(", ")}`;
        }
      }
      // REMOVED: The flawed countDocuments check is entirely gone.
    }
  }

  // Date validation remains exactly the same
  if (!appointmentDate) {
    errors.appointmentDate = errors.appointmentDate || "Appointment date is required";
  } else if (isNaN(Date.parse(appointmentDate))) {
    errors.appointmentDate = "Invalid date format";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (new Date(appointmentDate) < today) {
      errors.appointmentDate = "Appointment date cannot be in the past";
    }
  }

  if (Object.keys(errors).length > 0) {
    errorResponseBody.err = errors;
    errorResponseBody.message = "Validation failed";
    return res.status(400).json(errorResponseBody);
  }
  next();
};

module.exports = { validateAppointmentRequest };