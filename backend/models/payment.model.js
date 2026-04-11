const mongoose = require('mongoose');

// KHALTI PAYMENT MODEL (Nepal - NPR)
// Khalti works in PAISA (smallest unit of NPR).
// 1 NPR = 100 paisa. So NPR 500 = 50000 paisa.
// Always store `amount` in PAISA here.
// When showing to user, divide by 100.

const PaymentSchema = new mongoose.Schema({

    // The appointment this payment belongs to
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: true
    },

    // The user (patient) who made the payment
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    // Amount in PAISA (NPR × 100).
    // Example: NPR 500 → stored as 50000
    amount: {
        type: Number,
        required: true
    },

    // pidx is Khalti's unique identifier for a payment transaction.
    // Returned by Khalti on initiation. Used to verify the payment later.
    // Required only after initiation (not at document creation time).
    pidx: {
        type: String,
        default: null
    },

    // Khalti's own transaction ID — provided after successful payment verification.
    // This is the final proof of payment from Khalti's end.
    transactionId: {
        type: String,
        default: null
    },

    // Payment status lifecycle:
    // INITIATED  → Khalti order created, user redirected to Khalti
    // SUCCESS    → Khalti verified the payment successfully
    // FAILED     → Verification failed or Khalti returned failure
    // PENDING    → Default before initiation (safety net)
    status: {
        type: String,
        enum: ['PENDING', 'INITIATED', 'SUCCESS', 'FAILED'],
        default: 'PENDING'
        // DESIGN NOTE:
        // This uses 'SUCCESS' (not 'PAID') because this describes a transaction result.
        // The Appointment model uses 'PAID' because it describes a booking state.
        // Mapping: Payment.status = 'SUCCESS' → Appointment.paymentStatus = 'PAID'
        //          Payment.status = 'FAILED'  → Appointment.paymentStatus = 'FAILED'
    },

    // The return URL Khalti redirected to after payment attempt.
    // Stored for audit/debugging purposes.
    khaltiPaymentUrl: {
        type: String,
        default: null
    }

}, { timestamps: true });

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;