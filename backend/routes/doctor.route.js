const doctorController = require("../controllers/doctor.controller");
const doctorMiddleware = require("../middlewares/doctor.middleware");

const route = (app) => {
  app.post(
    "/hhc/api/v1/doctor",
    doctorMiddleware.validateCreateDoctorRequest,
    doctorController.createDocs,
  );
};

module.exports = route;
