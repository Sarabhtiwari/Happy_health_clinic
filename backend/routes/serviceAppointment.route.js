const serviceAppointmentController = require("../controllers/serviceAppointment.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const route = (app) => {
  app.get(
    "/hhc/api/v1/service-appointments",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    serviceAppointmentController.getAllBookings,
  );
  app.get(
    "/hhc/api/v1/service-appointments/me",
    authMiddleware.isAuthenticated,
    serviceAppointmentController.getMyBookings,
  );

  app.post(
    "/hhc/api/v1/service-appointments",
    authMiddleware.isAuthenticated,
    serviceAppointmentController.createBooking,
  );

  app.delete(
    "/hhc/api/v1/service-appointments/:id",
    authMiddleware.isAuthenticated,
    serviceAppointmentController.deleteBooking,
  );

  app.patch(
    "/hhc/api/v1/service-appointments/:id/status",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    serviceAppointmentController.updateBookingStatus,
  );
};

module.exports = route;
