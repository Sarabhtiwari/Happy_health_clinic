const mongoose = require("mongoose");

const DailyScheduleSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  date: { type: Date, required: true }, 
  bookedCount: { type: Number, default: 0 },
  maxCapacity: { type: Number, required: true }
});

// CRITICAL: This ensures only ONE document exists per doctor per day
DailyScheduleSchema.index({ doctor: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailySchedule", DailyScheduleSchema);