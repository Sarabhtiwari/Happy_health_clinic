const axios = require('axios');
const Payment = require('../models/payment.model');
const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model');

// ─── KHALTI CONFIG ───────────────────────────────────────────────────────────
// Khalti provides two environments:
//   Sandbox (test): https://dev.khalti.com/api/v2/
//   Live (prod):    https://khalti.com/api/v2/
//
// Set KHALTI_BASE_URL and KHALTI_SECRET_KEY in your .env file.
// For sandbox testing, get credentials from: https://dev.khalti.com
// ─────────────────────────────────────────────────────────────────────────────

const rawKhaltiBaseUrl = process.env.KHALTI_BASE_URL || 'https://dev.khalti.com/api/v2';
const KHALTI_BASE_URL = rawKhaltiBaseUrl.replace(/\/+$/, '');
const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

if (!KHALTI_SECRET_KEY) {
    throw { err: 'Khalti secret key is not configured. Set KHALTI_SECRET_KEY in .env', code: 500 };
}

// ─── INITIATE PAYMENT ─────────────────────────────────────────────────────────
// Step 1 of Khalti's 2-step flow.
// Creates a Khalti payment session and returns a `payment_url` to redirect the user to.
// Also creates a Payment document in our DB with status = 'INITIATED'.
//
// @param {string} appointmentId  - our Appointment ObjectId
// @param {string} userId         - our User ObjectId (the patient paying)
// @returns {object}              - { paymentUrl, pidx, paymentId }
// ─────────────────────────────────────────────────────────────────────────────
const initiatePayment = async (appointmentId, userId) => {
    try {
        // 1. Fetch the appointment with doctor info to get the fee
        const appointment = await Appointment.findById(appointmentId).populate('doctor');
        if (!appointment) {
            // console.log("Appointment not found");
            throw { err: "Appointment not found", code: 404 };
        }

        // 2. Guard: don't allow double payment
        if (appointment.paymentStatus === 'PAID') {
            throw { err: "This appointment is already paid for", code: 400 };
        }

        // 3. Get fee from the doctor (stored in NPR in Doctor model)
        //    Convert to paisa for Khalti (NPR × 100)
        const doctor = appointment.doctor;
        if (!doctor || doctor.fees == null) {
            // console.log("Doctor not found");
            throw { err: "Doctor fee information not found", code: 404 };
        }

        const amountInPaisa = doctor.fees * 100;
        // Minimum Khalti transaction is NPR 10 = 1000 paisa
        if (amountInPaisa < 1000) {
            throw { err: "Amount must be at least NPR 10 (1000 paisa)", code: 400 };
        }

        // 4. Build the return URL — Khalti redirects here after payment attempt
        //    This must be a publicly accessible URL in production.
        //    In dev, use ngrok or similar.
        const MY_SERVER_URL = process.env.MY_SERVER_URL || "http://localhost:5000";
        const returnUrl = `${MY_SERVER_URL}/hhc/api/v1/payment/verify`;

        // 5. Call Khalti's initiate endpoint
        const khaltiResponse = await axios.post(
            `${KHALTI_BASE_URL}/epayment/initiate/`,
            {
                return_url: returnUrl,
                website_url: MY_SERVER_URL,
                amount: amountInPaisa,         // in paisa
                purchase_order_id: appointmentId.toString(),
                purchase_order_name: `Doctor Appointment #${appointment.appointmentNo}`,
                customer_info: {
                    // NOTE: We only have userId here. For richer customer info,
                    // populate user before this call.
                    name: "Patient",
                    // email and phone are optional but recommended for Khalti records
                }
            },
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const { pidx, payment_url } = khaltiResponse.data;

        // 6. Create a Payment record in our DB
        const payment = await Payment.create({
            appointment: appointmentId,
            user: userId,
            amount: amountInPaisa,    // stored in paisa
            pidx: pidx,
            status: 'INITIATED',
            khaltiPaymentUrl: payment_url
        });

        // 7. Link the payment to the appointment
        await Appointment.findByIdAndUpdate(appointmentId, {
            payment: payment._id
        });

        return {
            paymentUrl: payment_url,   // frontend redirects user here
            pidx: pidx,
            paymentId: payment._id
        };

    } catch (error) {
        // Khalti API errors have response.data with details
        if (error.response) {
            console.error("Khalti initiate error:", error.response.data);
            throw {
                err: error.response.data?.detail || "Khalti payment initiation failed",
                code: error.response.status || 500
            };
        }
        throw error;
    }
};

// ─── VERIFY PAYMENT ───────────────────────────────────────────────────────────
// Step 2 of Khalti's 2-step flow.
// Called when Khalti redirects the user back to our return_url.
// Khalti appends `pidx`, `status`, `transaction_id`, etc. as query params.
//
// We call Khalti's lookup endpoint to VERIFY the payment server-side
// (never trust only the redirect params — always verify with Khalti API).
//
// @param {string} pidx  - the pidx from Khalti's redirect query params
// @returns {object}     - { appointment, payment }
// ─────────────────────────────────────────────────────────────────────────────
const verifyPayment = async (pidx) => {
    try {
        // 1. Call Khalti lookup API — this is the authoritative verification
        const khaltiResponse = await axios.post(
            `${KHALTI_BASE_URL}/epayment/lookup/`,
            { pidx },
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const { status, transaction_id, total_amount } = khaltiResponse.data;

        // 2. Find our Payment record by pidx
        const payment = await Payment.findOne({ pidx });
        if (!payment) {
            throw { err: "Payment record not found for this pidx", code: 404 };
        }

        // 3. Guard: prevent double-processing
        if (payment.status === 'SUCCESS') {
            const appointment = await Appointment.findById(payment.appointment);
            return { appointment, payment };
        }

        // 4. Verify the amount matches (prevent tampering)
        //    Khalti returns total_amount in paisa — same unit as our stored amount
        if (total_amount !== payment.amount) {
            await Payment.findByIdAndUpdate(payment._id, { status: 'FAILED' });
            await Appointment.findByIdAndUpdate(payment.appointment, {
                paymentStatus: 'FAILED'
            });
            throw { err: "Amount mismatch — payment verification failed", code: 400 };
        }

        // 5. Map Khalti status to our status
        //    Khalti statuses: Completed, Pending, Initiated, Refunded, Expired, User canceled, Failed
        if (status === 'Completed') {
            // Payment succeeded
            await Payment.findByIdAndUpdate(payment._id, {
                status: 'SUCCESS',
                transactionId: transaction_id
            });

            const updatedAppointment = await Appointment.findByIdAndUpdate(
                payment.appointment,
                { paymentStatus: 'PAID' },
                { new: true }
            );

            return {
                appointment: updatedAppointment,
                payment: await Payment.findById(payment._id)
            };

        } else {
            // Any other Khalti status is treated as failed on our end
            await Payment.findByIdAndUpdate(payment._id, { status: 'FAILED' });
            await Appointment.findByIdAndUpdate(payment.appointment, {
                paymentStatus: 'FAILED'
            });
            throw {
                err: `Payment not completed. Khalti status: ${status}`,
                code: 400
            };
        }

    } catch (error) {
        if (error.response) {
            console.error("Khalti verify error:", error.response.data);
            throw {
                err: error.response.data?.detail || "Khalti payment verification failed",
                code: error.response.status || 500
            };
        }
        throw error;
    }
};

// ─── GET PAYMENT BY APPOINTMENT ──────────────────────────────────────────────
// Fetch payment details for a given appointment ID.
// Useful for admin dashboards or patient payment history.
// ─────────────────────────────────────────────────────────────────────────────
const getPaymentByAppointment = async (appointmentId) => {
    try {
        const payment = await Payment.findOne({ appointment: appointmentId })
            .populate('user', 'name email')
            .populate('appointment');

        if (!payment) {
            throw { err: "No payment found for this appointment", code: 404 };
        }
        return payment;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    initiatePayment,
    verifyPayment,
    getPaymentByAppointment
};