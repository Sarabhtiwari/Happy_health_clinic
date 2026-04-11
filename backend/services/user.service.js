const Doctor = require("../models/doctor.model");
const User = require("../models/user.model");

const createUser = async (data) => {
  try {
    const response = await User.create(data);
    return response;
  } catch (error) {
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });
      throw { err: err, code: 422 };
    }
    if (error.code === 11000) {
      throw { err: "Email already exists", code: 400 };
    }
    throw error;
  }
};

const getUserByEmail = async (email) => {
  try {
    const response = await User.findOne({
      email: email,
    });

    if (!response) {
      throw { err: "No user found for the given email", code: 404 };
    }
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      console.log(id);
      throw { err: "No user found for the given id", code: 404 };
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
};
