const mongoose = require('mongoose');
const { errorResponseBody } = require('../utils/responseBody');
const Appointment = require('../models/appointment.model');

// ─── VALIDATE INITIATE PAYMENT REQUEST ───────────────────────────────────────
// Runs before initiatePayment controller.
// Validates that:
//   1. appointmentId param is a valid MongoDB ObjectId
//   2. The appointment actually exists
//   3. The appointment is not already PAID (prevent double charge)
// ─────────────────────────────────────────────────────────────────────────────
const validateInitiatePayment = async (req, res, next) => {
    console.log("Validating initiate payment request...");
    const { appointmentId } = req.params;

    // 1. Check appointmentId is present and valid
    if (!appointmentId) {
        errorResponseBody.err = "appointmentId is required in route params";
        return res.status(400).json(errorResponseBody);
    }

    if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
        errorResponseBody.err = "Invalid appointmentId format";
        return res.status(400).json(errorResponseBody);
    }

    // 2. Check appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        errorResponseBody.err = "Appointment not found";
        return res.status(404).json(errorResponseBody);
    }

    // 3. Prevent double payment
    if (appointment.paymentStatus === 'PAID') {
        errorResponseBody.err = "This appointment is already paid for";
        return res.status(400).json(errorResponseBody);
    }

    next();
};

module.exports = {
    validateInitiatePayment
};