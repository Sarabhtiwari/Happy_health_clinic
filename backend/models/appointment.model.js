const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ['PAID', 'FAILED', 'PENDING'],
        default: 'PENDING'
        // INTENTIONAL DESIGN NOTE:
        // This uses 'PAID' (not 'SUCCESS') because this is domain/business language.
        // The Payment model uses 'SUCCESS' because it describes a transaction result.
        // These are two different things on purpose — an appointment is "paid for",
        // a payment transaction "succeeded". Do not unify these enums.
        // Mapping: Payment.status = 'SUCCESS' => Appointment.paymentStatus = 'PAID'
        //          Payment.status = 'FAILED'  => Appointment.paymentStatus = 'FAILED'
    },

    appointmentNo: {
        type: Number,
        required: true
    },

    dateOfAppointment: {
        type: Date,
        required: true
    },

    // CHANGED: was `paymentId: String` — a loose untyped string with no reference.
    // Problem: it was ambiguous (Razorpay ID string? Our DB ID?), unvalidated,
    // and could not be populated with .populate().
    // FIX: replaced with a proper ObjectId reference to our Payment document.
    // This lets you do Appointment.findById(id).populate('payment') to get full
    // payment details without a second query.
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        default: null
    },

    // REMOVED: `amount: Number` that existed in the original model.
    // Problem: it duplicated the amount already stored in the Payment model,
    // but in a different unit (rupees here vs paise in Payment). This silent
    // unit mismatch would cause real bugs (e.g., showing ₹50000 instead of ₹500).
    // FIX: amount now lives ONLY in the Payment model (in paise).
    // To get the amount for an appointment, populate the payment field.

}, { timestamps: true });

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;