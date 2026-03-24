const Appointment = require("../models/appointment.model");

const createAppointment = async (data) => {
  try {
    const response = await Appointment.create(data);
    return response;
  } catch (error) {
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw { err: err, code: 422 };
    }
    throw error;
  }
};

module.exports = {
    createAppointment
}