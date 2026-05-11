const ServiceAppointment = require("../models/serviceAppointment.model");

const createBooking = async (userId, serviceId, date) => {
  try {
    if (!serviceId || !date) {
      throw {
        code: 400,
        err: "Service ID and Date are required",
      };
    }

    const newBooking = await ServiceAppointment.create({
      user: userId,
      service: serviceId,
      date,
    });

    return newBooking;
  } catch (error) {
    throw {
      code: error.code || 500,
      err: error.err || error.message,
    };
  }
};

const deleteBooking = async (appointmentId, userId) => {
  try {
    const deletedBooking = await ServiceAppointment.findOneAndDelete({
      _id: appointmentId,
      user: userId,
    });

    if (!deletedBooking) {
      throw {
        code: 404,
        err: "Booking not found or not authorized",
      };
    }

    return deletedBooking;
  } catch (error) {
    throw {
      code: error.code || 500,
      err: error.err || error.message,
    };
  }
};

const getMyBookings = async (userId) => {
  try {
    // console.log("Fetching bookings for userId:", userId); // add this
  const bookings = await ServiceAppointment.find({ user: userId });
  // console.log("Found bookingx`s:", bookings);
    // const bookings = await ServiceAppointment.find({ user: userId })
    //   .populate("service", "title priceRange image");

    return bookings;
  } catch (error) {
    throw {
      code: 500,
      err: error.message || error,
    };
  }
};

const getAllBookings = async (filters = {}) => {
  try {
    const { name, mob_no } = filters;

    const bookings = await ServiceAppointment.find()
      .populate({
        path: "user",
        select: "name email mob_no",
        match: {
          ...(name && { name: { $regex: name, $options: "i" } }),
          ...(mob_no && { mob_no: { $regex: mob_no, $options: "i" } }),
        },
      })
      .populate("service", "title priceRange")
      .sort({ createdAt: -1 });

    // When populate match fails, user becomes null — filter those out
    return bookings.filter((b) => b.user !== null);
  } catch (error) {
    throw { code: 500, err: error.message || error };
  }
};

const updateBookingStatus = async (appointmentId, status) => {
  try {
    const VALID = ["PENDING", "DONE"];
    if (!VALID.includes(status)) {
      throw { code: 400, err: "Invalid status. Must be PENDING or DONE" };
    }

    const updated = await ServiceAppointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    )
      .populate("user", "name email mob_no")
      .populate("service", "title priceRange");

    if (!updated) {
      throw { code: 404, err: "Appointment not found" };
    }

    return updated;
  } catch (error) {
    throw { code: error.code || 500, err: error.err || error.message };
  }
};

module.exports = {
  createBooking,
  deleteBooking,
  getMyBookings,
  getAllBookings,
  updateBookingStatus,
};
