const adminController = require("../controllers/admin.controller");
const appointmentController = require("../controllers/appointment.controller");
const adminMiddleware = require("../middlewares/admin.middleware");
const authMiddleware = require("../middlewares/auth.middleware");

const routes = (app) => {

  app.get(
    "/hhc/api/v1/admin/stats",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    adminController.getDashboardStats,
  );

  app.get(
    "/hhc/api/v1/admin/appointments",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    appointmentController.getAllAppointments,
  );

  app.get(
    "/hhc/api/v1/admin/appointments/:id",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    appointmentController.fetchAppointmentById,
  );

  app.patch(
    "/hhc/api/v1/admin/appointments/:id/status",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    adminController.updateAppointmentStatus,
  );

  app.delete(
    "/hhc/api/v1/admin/appointments/:id",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    appointmentController.deleteAppointment,
  );

  // ── Users ──────────────────────────────────────────────────────────────────
  app.get(
    "/hhc/api/v1/admin/users",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    adminController.getAllUsers,
  );
  
  app.delete(
    "/hhc/api/v1/admin/users/:id",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    adminController.deleteUser,
  );

  // this service is in appointment service and controller in appointment controller
  app.get(
    "/hhc/api/v1/admin/appointments",
    authMiddleware.isAuthenticated,
    adminMiddleware.isAdmin,
    appointmentController.getAllAppointments
  );
};

module.exports = routes;
