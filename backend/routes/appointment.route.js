const appointmentController = require("../controllers/appointment.controller");
const appointmentMiddleware = require("../middlewares/appointment.middleware");
const authMiddleware = require('../middlewares/auth.middleware');

const route = (app) => {
  app.post(
    "/hhc/api/v1/doctors/:doctorId/appointments",
    authMiddleware.isAuthenticated,
    appointmentMiddleware.validateAppointmentRequest,
    appointmentController.createAppointments,
  );

  app.get("/hhc/api/v1/appointments", appointmentController.getAllAppointments);
};

module.exports = route;
