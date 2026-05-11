const serviceService = require("../services/services.service");

const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");

const createService = async (req, res) => {
  try {
    const response = await serviceService.createService(req.body);

    successResponseBody.data = response;
    successResponseBody.message = "Service created successfully";
    return res.status(201).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

const getAllServices = async (req, res) => {
  try {
    const response = await serviceService.getAllServices();

    successResponseBody.data = response;
    successResponseBody.message = "Services fetched successfully";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

module.exports = {
  createService,
  getAllServices,
};
