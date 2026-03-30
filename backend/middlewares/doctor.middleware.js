const Doctor = require("../models/doctor.model");
const User = require("../models/user.model");
const { errorResponseBody } = require("../utils/responseBody");

const validateCreateDoctorRequest = async (req, res, next) => {
  if (!req.body.name) {
    errorResponseBody.err = "Please provide name";
    return res.status(400).json(errorResponseBody);
  }

  if (!req.body.fees) {
    errorResponseBody.err = "Please provide fees";
    return res.status(400).json(errorResponseBody);
  }

  if (!req.body.description) {
    errorResponseBody.err = "Please provide description";
    return res.status(400).json(errorResponseBody);
  }

  if (!req.body.qualification) {
    errorResponseBody.err = "Please provide qualification";
    return res.status(400).json(errorResponseBody);
  }

  if (!req.body.maxAppointmentsPerDay) {
    errorResponseBody.err = "Please provide maxAppointmentsPerDay";
    return res.status(400).json(errorResponseBody);
  }
  next();
};

const isAdmin = async (req, res, next) => {
  try {
    const id = req.user;
    const user = await User.findById(id); //we're giving one doctor the
    // status of admin admin details in user and rest of details of doctor admin in doctor model
    if (!user.userRole || user.userRole !== "ADMIN") {
      errorResponseBody.err = "User is not admin";
      return res.status(404).json(errorResponseBody);
    }
    next();
  } catch (error) {}
};
module.exports = {
  validateCreateDoctorRequest,
  isAdmin
};
