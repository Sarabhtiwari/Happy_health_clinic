const mongoose = require('mongoose');

const DoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
   description: {
        type: String,
        required:true
   },
   qualification: {
        type: String,
        required: true
   },
},{timestamps: true})

const Doctor = mongoose.model('Doctor',DoctorSchema);
module.exports = Doctor