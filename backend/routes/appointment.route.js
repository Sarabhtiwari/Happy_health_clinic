const appointmentController = require("../controllers/appointment.controller");
const appointmentMiddleware = require("../middlewares/appointment.middleware");
const route = (app) => {
  app.post(
    "/hhc/api/v1/doctors/:doctorId/appointments",
    appointmentMiddleware.validateAppointmentRequest,
    appointmentController.createAppointments,
  );
};

module.exports = route;
