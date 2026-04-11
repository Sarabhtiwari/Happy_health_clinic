const appointmentService = require("../services/appointment.service");
const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");

const createAppointments = async (req, res) => {
  try {
    if (!req.user) {
      errorResponseBody.err = "User not authenticated";
      return res.status(401).json(errorResponseBody);
    }

    // Only date now — no time. Store as start of that day in UTC.
    const appointmentDate = new Date(req.body.appointmentDate);
    appointmentDate.setHours(0, 0, 0, 0);

    if (isNaN(appointmentDate.getTime())) {
      errorResponseBody.err = "Invalid appointment date format";
      return res.status(400).json(errorResponseBody);
    }

    const response = await appointmentService.createAppointment({
      doctor: req.params.doctorId,
      user: req.user,
      dateOfAppointment: appointmentDate,
    });

    successResponseBody.data = response;
    successResponseBody.message = "Successfully created the Appointment";
    return res.status(201).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(500).json(errorResponseBody);
  }
};

const getAllAppointments = async (req, res) => {
  try {
    const response = await appointmentService.getAppointments(req.query);
    successResponseBody.data = response;
    successResponseBody.message = "Successfully fetched all appointments";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error;
    return res.status(500).json(errorResponseBody);
  }
};

const fetchAppointmentById = async (req, res) => {
  try {
    const response = await appointmentService.getAppointmentById(
      req.params.appointmentId
    );
    successResponseBody.data = response;
    successResponseBody.message = "Successfully fetched the appointment";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error;
    return res.status(500).json(errorResponseBody);
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const response = await appointmentService.deleteAppointment(
      req.params.appointmentId
    );
    successResponseBody.data = response;
    successResponseBody.message = "Appointment cancelled. Please create a new one.";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    if (error.err) {
      errorResponseBody.err = error.err;
      return res.status(error.code).json(errorResponseBody);
    }
    errorResponseBody.err = error;
    return res.status(500).json(errorResponseBody);
  }
};

const checkForAppointmentAvailability = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const dateOfAppointment = new Date(req.query.dateOfAppointment);
    dateOfAppointment.setHours(0, 0, 0, 0);

    const response = await appointmentService.checkForAppointmentCount(doctorId, dateOfAppointment);
    successResponseBody.data = response;
    successResponseBody.message = "Successfully checked appointment availability";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error;
    return res.status(500).json(errorResponseBody);
  }
};


module.exports = {
  createAppointments,
  getAllAppointments,
  fetchAppointmentById,
  deleteAppointment,
  checkForAppointmentAvailability
};