const User = require("../models/user.model");
const { errorResponseBody } = require('../utils/responseBody');

const isAdmin = async (req, res, next) => {
  try {
    const id = req.user;
    const user = await User.findById(id); 
    if (!user) {
      errorResponseBody.err = "No user found for the given id";
      return res.status(404).json(errorResponseBody);
    }

    if (!user.userRole || user.userRole !== "ADMIN") {
      errorResponseBody.err = "User is not admin";
      return res.status(403).json(errorResponseBody);
    }
    next();
  } catch (error) {
    // console.log(error);
    errorResponseBody.err = error;
    return res.status(500).json(errorResponseBody);
  }
};


module.exports = {
  isAdmin
};
