const serviceAppointmentService = require("../services/serviceAppointment.service");

const {
  successResponseBody,
  errorResponseBody,
} = require("../utils/responseBody");

const createBooking = async (req, res) => {
  try {
    const response = await serviceAppointmentService.createBooking(
      req.user,
      req.body.serviceId,
      req.body.date
    );

    successResponseBody.data = response;
    successResponseBody.message = "Service booked successfully";
    return res.status(201).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

const deleteBooking = async (req, res) => {
  try {
    await serviceAppointmentService.deleteBooking(
      req.params.id,
      req.user
    );

    successResponseBody.data = {};
    successResponseBody.message = "Service appointment cancelled successfully";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

const getMyBookings = async (req, res) => {
  try {
    const response = await serviceAppointmentService.getMyBookings(
      req.user
    );

    successResponseBody.data = response;
    successResponseBody.message = "Bookings fetched successfully";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

const getAllBookings = async (req, res) => {
  try {
    const { name, mob_no } = req.query;
    const response = await serviceAppointmentService.getAllBookings({ name, mob_no });
    successResponseBody.data = response;
    successResponseBody.message = "All bookings fetched successfully";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const response = await serviceAppointmentService.updateBookingStatus(
      req.params.id,
      req.body.status
    );
    successResponseBody.data = response;
    successResponseBody.message = "Status updated successfully";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

module.exports = {
  createBooking,
  deleteBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
};