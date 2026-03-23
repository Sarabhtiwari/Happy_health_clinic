const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    maxAppointmentsPerDay: {
      type: Number,
      required: true,
    },
    workingHours: {
      start: { type: String, default: "10:00" },
      end: { type: String, default: "18:00" },
    },
    availableDays: {
      type: [String],
      default: ["MON", "TUE", "WED", "THU", "FRI"],
    },

    //under consideration
    // isActive: {
    //   type: Boolean,
    //   default: true,
    // },
  },
  { timestamps: true },
);

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
