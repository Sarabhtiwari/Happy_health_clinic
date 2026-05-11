const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    desc: {
      type: String,
      required: true
    },
    details: {
      type: String,
      required: true
    },
    priceRange: {
      type: String,
      required: true 
    },
    image: {
      type: String,
      required: true 
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);