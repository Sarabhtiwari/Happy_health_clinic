const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PAID", "FAILED", "PENDING"],
      default: "PENDING",
    },
    dateOfAppointment: {
      type: Date,
      required: true,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      default: null,
    },
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;