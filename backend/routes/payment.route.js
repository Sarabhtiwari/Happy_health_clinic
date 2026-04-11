const paymentController = require('../controllers/payment.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { validateInitiatePayment } = require('../middlewares/payment.middleware');

// ─── PAYMENT ROUTES ───────────────────────────────────────────────────────────
//
// Base path registered in index.js: /api/v1/payment
//
// Routes:
//   POST   /api/v1/payment/initiate/:appointmentId  → initiate Khalti payment
//   GET    /api/v1/payment/verify                   → Khalti return_url (no auth)
//   GET    /api/v1/payment/appointment/:appointmentId → fetch payment by appointment
//
// ─────────────────────────────────────────────────────────────────────────────

const paymentRoutes = (app) => {

    // Initiate payment for a given appointment
    // Protected: user must be logged in
    // Middleware: validateInitiatePayment checks appointment exists and isn't already paid
    app.post(
        '/hhc/api/v1/payment/initiate/:appointmentId',
        isAuthenticated,
        validateInitiatePayment,
        paymentController.initiatePayment
    );

    // Khalti return URL — called by Khalti redirect after payment attempt
    // NO isAuthenticated here — Khalti redirects the browser, no JWT token is sent
    // pidx is passed as a query param by Khalti: /api/v1/payment/verify?pidx=xxx
    app.get(
        '/hhc/api/v1/payment/verify',
        paymentController.verifyPayment
    );

    // Get payment details for a specific appointment
    // Protected: user must be logged in
    app.get(
        '/hhc/api/v1/payment/appointment/:appointmentId',
        isAuthenticated,
        paymentController.getPaymentByAppointment
    );

};

module.exports = paymentRoutes;