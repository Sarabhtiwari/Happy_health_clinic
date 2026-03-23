const Doctor = require("../models/doctor.model");

const createDoctor = async (data) => {
  try {
    const response = await Doctor.create(data);
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
    createDoctor
}