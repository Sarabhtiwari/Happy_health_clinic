const Service = require("../models/services.model");

const createService = async (data) => {
  try {
    const { title, desc, details, image } = data;

    const newService = await Service.create({
      title,
      desc,
      details,
      image,
    });

    return newService;
  } catch (error) {
    throw {
      code: 500,
      err: error.message || error,
    };
  }
};

const getAllServices = async () => {
  try {
    const services = await Service.find({}).sort({ createdAt: -1 });
    return services;
  } catch (error) {
    throw {
      code: 500,
      err: error.message || error,
    };
  }
};

module.exports = {
  createService,
  getAllServices,
};