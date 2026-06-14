const axios = require('axios');
const Payment = require('../models/payment.model');
const Appointment = require('../models/appointment.model');
const Doctor = require('../models/doctor.model');
const DailySchedule = require('../models/dailySchedule.model'); // <-- NEW IMPORT

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
const initiatePayment = async (appointmentId, userId) => {
    try {
        // 1. Fetch the appointment with doctor info to get the fee
        const appointment = await Appointment.findById(appointmentId).populate('doctor');
        if (!appointment) {
            throw { err: "Appointment not found", code: 404 };
        }

        // 2. Guard: don't allow double payment
        if (appointment.paymentStatus === 'PAID') {
            throw { err: "This appointment is already paid for", code: 400 };
        }

        // 3. Get fee from the doctor (stored in NPR in Doctor model)
        const doctor = appointment.doctor;
        if (!doctor || doctor.fees == null) {
            throw { err: "Doctor fee information not found", code: 404 };
        }

        const amountInPaisa = doctor.fees * 100;
        // Minimum Khalti transaction is NPR 10 = 1000 paisa
        if (amountInPaisa < 1000) {
            throw { err: "Amount must be at least NPR 10 (1000 paisa)", code: 400 };
        }

        // 4. Build the return URL
        const MY_SERVER_URL = process.env.MY_SERVER_URL || "http://localhost:5000";
        const returnUrl = `${MY_SERVER_URL}/hhc/api/v1/payment/verify`;

        // 5. Call Khalti's initiate endpoint
        const khaltiResponse = await axios.post(
            `${KHALTI_BASE_URL}/epayment/initiate/`,
            {
                return_url: returnUrl,
                website_url: MY_SERVER_URL,
                amount: amountInPaisa,         
                purchase_order_id: appointmentId.toString(),
                purchase_order_name: `Appointment ${appointment._id.toString().slice(-6).toUpperCase()}`,
                customer_info: {
                    name: "Patient",
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
            amount: amountInPaisa,
            pidx: pidx,
            status: 'INITIATED',
            khaltiPaymentUrl: payment_url
        });

        // 7. Link the payment to the appointment
        await Appointment.findByIdAndUpdate(appointmentId, {
            payment: payment._id
        });

        return {
            paymentUrl: payment_url,   
            pidx: pidx,
            paymentId: payment._id
        };

    } catch (error) {
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
const verifyPayment = async (pidx) => {
    try {
        // 1. Call Khalti lookup API
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

        // ─── HELPER FUNCTION: HANDLE PAYMENT FAILURE & RELEASE SLOT ───
        const handleFailureAndReleaseSlot = async (errorMessage) => {
            // Update payment to failed
            await Payment.findByIdAndUpdate(payment._id, { status: 'FAILED' });
            
            // Update appointment to failed and return the document
            const failedAppt = await Appointment.findByIdAndUpdate(
                payment.appointment, 
                { paymentStatus: 'FAILED' },
                { new: true }
            );

            // Give the slot back to the doctor's daily capacity
            if (failedAppt) {
                const normalizedDate = new Date(failedAppt.dateOfAppointment);
                normalizedDate.setHours(0, 0, 0, 0);

                await DailySchedule.findOneAndUpdate(
                    { doctor: failedAppt.doctor, date: normalizedDate },
                    { $inc: { bookedCount: -1 } } 
                );
            }

            throw { err: errorMessage, code: 400 };
        };
        // ──────────────────────────────────────────────────────────────

        // 4. Verify the amount matches (prevent tampering)
        if (total_amount !== payment.amount) {
            await handleFailureAndReleaseSlot("Amount mismatch — payment verification failed");
        }

        // 5. Map Khalti status to our status
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
            // Any other Khalti status (User canceled, Expired, Failed)
            await handleFailureAndReleaseSlot(`Payment not completed. Khalti status: ${status}`);
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