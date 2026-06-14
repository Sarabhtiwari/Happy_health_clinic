const mongoose = require("mongoose");

const serviceAppointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    
    date: {
      type: String, 
      required: true,
    },
    
    status: {
      type: String,
      enum: ["PENDING", "DONE"],
      default: "PENDING",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceAppointment", serviceAppointmentSchema);