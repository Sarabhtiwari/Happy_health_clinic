const appointmentService = require("../services/appointment.service");
const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");

const createAppointments = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      errorResponseBody.err = "User not authenticated";
      return res.status(401).json(errorResponseBody);
    }

    // Combine date and time into a single Date object
    const appointmentDateTime = new Date(`${req.body.appointmentDate}T${req.body.appointmentTime}`);

    // Validate that the combined date/time is valid
    if (isNaN(appointmentDateTime.getTime())) {
      errorResponseBody.err = "Invalid appointment date or time format";
      return res.status(400).json(errorResponseBody);
    }

    const response = await appointmentService.createAppointment({
            doctor: req.params.doctorId,
            user: req.user, // Use req.user from auth middleware instead of req.body.user
            dateOfAppointment: appointmentDateTime,
            // paymentStatus intentionally NOT included here.
            // It defaults to 'PENDING' in the model and can only be changed
            // by the payment service after a verified payment.
        });

    successResponseBody.data = response;
    successResponseBody.message = "Successfully created the Appointment";
    return res.status(201).json(successResponseBody);
  } catch (error) {
    console.log(error);
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
    const response = await appointmentService.getAppointmentById(req.params.appointmentId);
    successResponseBody.data = response;
    successResponseBody.message = "Successfully fetched the appointment";
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
};
