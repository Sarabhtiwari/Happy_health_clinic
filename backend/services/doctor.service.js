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

const getDoctors = async() => {
  try {
    const response = await Doctor.find().populate("user", "name email");  
    return response;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};

const fetchDoctorById = async (doctorId) => {
  try {
    const response = await Doctor.findById(doctorId).populate("user", "name email");  
    if (!response) {
      throw { err: "Doctor not found", code: 404 };
    }
    return response;
  } catch (error) {
    // console.log(error);
    throw error;
  }
};
module.exports = {
    createDoctor,
    getDoctors,
    fetchDoctorById,
}