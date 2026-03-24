const mongoose = require("mongoose");
const { errorResponseBody } = require("../utils/responseBody");
const User = require('../models/user.model')

const validateAppointmentRequest = async (req, res, next) => {
    const {
        user,               
        dateOfAppointment,
        paymentStatus
    } = req.body;

    let errors = {};

    if (!user) {
        errors.user = "User ID is required";
    } else if (!mongoose.Types.ObjectId.isValid(user)) {
        errors.user = "Invalid User ID";
    } else {
        const existingUser = await User.findById(user);

        if (!existingUser) {
            errors.user = "User not found, register first";
        }
    }

    //DoctorId param check
    if (!req.params.doctorId) {
        errors.doctorId = "Doctor ID is required in params";
    } else if (!mongoose.Types.ObjectId.isValid(req.params.doctorId)) {
        errors.doctorId = "Invalid Doctor ID";
    }

    // Date validation
    if (!dateOfAppointment) {
        errors.dateOfAppointment = "Date of appointment is required";
    } else if (isNaN(Date.parse(dateOfAppointment))) {
        errors.dateOfAppointment = "Invalid date format";
    } else if (new Date(dateOfAppointment) < new Date()) {
        errors.dateOfAppointment = "Appointment date cannot be in the past";
    }

    //Payment status validation
    const validPaymentStatus = ['PAID', 'FAILED', 'PENDING'];

    if (paymentStatus && !validPaymentStatus.includes(paymentStatus)) {
        errors.paymentStatus = "Invalid payment status";
    }

    if (Object.keys(errors).length > 0) {
        errorResponseBody.err = errors;
        errorResponseBody.message = 'Validation failed';
        return res.status(400).json(errorResponseBody);
    }

    next();
};

module.exports = {
    validateAppointmentRequest
}