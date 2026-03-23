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

    status: {
        type: String,
        enum: ['CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'],
        default: 'CONFIRMED'
    },

    paymentStatus: {
        type: String,
        enum: ['PAID', 'FAILED', 'PENDING'],
        default: 'PENDING'
    },

    appointmentNo: { 
        type: Number,
        required: true
    },

    dateOfAppointment: {
        type: Date,
        required: true
    },
    paymentId: String,
    amount: Number,
}, { timestamps: true });

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;