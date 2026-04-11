const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // NOTE FOR PAYMENT INTEGRATION:
    // This `fees` field is in RUPEES (e.g., 500 means ₹500).
    // When creating a Razorpay order, multiply by 100 to convert to paise.
    // Razorpay always works in the smallest currency unit (paise for INR).
    // See payment.service.js -> createOrder() for this conversion.
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
        start: {
            type: String,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/,
            default: "10:00"
        },
        end: {
            type: String,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/,
            default: "18:00"
        }
    },
    availableDays: {
        type: [String],
        enum: ["MON","TUE","WED","THU","FRI","SAT","SUN"],
        default: ["MON","TUE","WED","THU","FRI"]
    }

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
