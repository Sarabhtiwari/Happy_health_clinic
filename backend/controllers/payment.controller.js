const paymentService = require('../services/payment.service');
const { successResponseBody, errorResponseBody } = require('../utils/responseBody');

// ─── INITIATE PAYMENT ─────────────────────────────────────────────────────────
// POST /api/v1/payment/initiate/:appointmentId
// Protected: user must be authenticated (isAuthenticated middleware)
//
// Response includes `paymentUrl` — the frontend should redirect the user to this URL.
// ─────────────────────────────────────────────────────────────────────────────

const initiatePayment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user; // set by isAuthenticated middleware

        const result = await paymentService.initiatePayment(appointmentId, userId);

        successResponseBody.message = "Payment initiated successfully. Redirect user to paymentUrl.";
        successResponseBody.data = {
            paymentUrl: result.paymentUrl,   // redirect the user to this
            pidx: result.pidx,
            paymentId: result.paymentId
        };
        return res.status(200).json(successResponseBody);

    } catch (error) {
        console.error("initiatePayment controller error:", error);
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
};

// ─── VERIFY PAYMENT ───────────────────────────────────────────────────────────
// GET /api/v1/payment/verify?pidx=...
//
// This is the Khalti return_url endpoint.
// Khalti redirects the user here after a payment attempt with query params:
//   pidx, status, transaction_id, total_amount, mobile, purchase_order_id, etc.
//
// We extract `pidx` from query params and call our service to verify with Khalti API.
// No auth middleware on this route because Khalti hits it as a redirect (no token).
//
// IMPORTANT: After verification, redirect the user to the frontend with result.
// ──────────────────────────────────────────────────────────────────────────
const verifyPayment = async (req, res) => {
    try {
        const { pidx } = req.query;

        if (!pidx) {
            errorResponseBody.err = "pidx is required in query params";
            return res.status(400).json(errorResponseBody);
        }

        const result = await paymentService.verifyPayment(pidx);

        // Option A: Return JSON (for API-only / SPA backends)
        successResponseBody.message = "Payment verified successfully";
        successResponseBody.data = {
            appointmentId: result.appointment._id,
            appointmentNo: result.appointment.appointmentNo,
            paymentStatus: result.appointment.paymentStatus,  // 'PAID'
            transactionId: result.payment.transactionId,
            // Amount in NPR for display (stored in paisa, divide by 100)
            amountNPR: result.payment.amount / 100
        };
        // return res.status(200).json(successResponseBody);

        // Option B: Redirect to frontend (recommended for better UX)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        return res.redirect(
          `${frontendUrl}/payment/success?pidx=${pidx}&appointmentId=${result.appointment._id}`
        );

    } catch (error) {
        console.error("verifyPayment controller error:", error);

        // Option B failure redirect (redirect to frontend failed page)
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const pidx = req.query.pidx;
        const appointmentId = req.query.purchase_order_id; // Khalti passes this
        return res.redirect(
          `${frontendUrl}/payment/failed?status=Failed&pidx=${pidx || ''}&appointmentId=${appointmentId || ''}`
        );

        // Option A: Return JSON error (uncomment for API-only)
        // if (error.err) {
        //     errorResponseBody.err = error.err;
        //     return res.status(error.code).json(errorResponseBody);
        // }
        // errorResponseBody.err = error;
        // return res.status(500).json(errorResponseBody);
    }
};

// ─── GET PAYMENT BY APPOINTMENT ──────────────────────────────────────────────
// GET /api/v1/payment/appointment/:appointmentId
// Protected: isAuthenticated
// ─────────────────────────────────────────────────────────────────────────────
const getPaymentByAppointment = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentByAppointment(req.params.appointmentId);

        successResponseBody.message = "Payment details fetched successfully";
        successResponseBody.data = {
            ...payment.toObject(),
            // Convert paisa → NPR for display
            amountNPR: payment.amount / 100
        };
        return res.status(200).json(successResponseBody);

    } catch (error) {
        if (error.err) {
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
};

module.exports = {
    initiatePayment,
    verifyPayment,
    getPaymentByAppointment
};