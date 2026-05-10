const doctorController = require("../controllers/doctor.controller");
const doctorMiddleware = require("../middlewares/doctor.middleware");
const authMiddleware = require('../middlewares/auth.middleware');
const adminMiddleware = require('../middlewares/admin.middleware');

const route = (app) => {
  app.post(
    "/hhc/api/v1/doctor",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    doctorMiddleware.validateCreateDoctorRequest,
    doctorController.createDocs
  );

  app.get("/hhc/api/v1/doctors", doctorController.getDocs);
  app.get("/hhc/api/v1/doctors/:doctorId", doctorController.getDocById);
};

module.exports = route;
