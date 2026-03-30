const doctorService = require("../services/doctor.service");
const userService = require("../services/user.service");
const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");

const createDocs = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      fees,
      description,
      qualification,
      maxAppointmentsPerDay,
      workingHours,
      availableDays,
    } = req.body;

    const user = await userService.createUser({
      name,
      email,
      password,
      userRole: "DOCTOR",
    });

    const doctor = await doctorService.createDoctor({
      user: user._id, 
      name,
      fees,
      description,
      qualification,
      maxAppointmentsPerDay,
      workingHours,
      availableDays,
    });

    successResponseBody.data = doctor;
    successResponseBody.message = "Successfully created the doctor";
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

module.exports = {
  createDocs,
};
