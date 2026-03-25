const appointmentService = require("../services/appointment.service");
const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");

const createAppointments = async (req, res) => {
  try {
    // console.log(req.params,req.params.doctorId,req.body);
    const response = await appointmentService.createAppointment({
      doctor: req.params.doctorId,
      user: req.body.user,
      ...req.body,
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

module.exports = {
  createAppointments,
  getAllAppointments,
};
