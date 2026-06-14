const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const DailySchedule = require("../models/dailySchedule.model");

const createAppointment = async (data) => {
  const normalizedDate = new Date(data.dateOfAppointment);
  normalizedDate.setHours(0, 0, 0, 0);

  try {
    const doctor = await Doctor.findById(data.doctor);
    if (!doctor) throw { err: "Doctor not found", code: 404 };

    // 1. Ensure the schedule document exists for today
    let schedule = await DailySchedule.findOne({ 
      doctor: doctor._id, 
      date: normalizedDate 
    });

    if (!schedule) {
      try {
        schedule = await DailySchedule.create({
          doctor: doctor._id,
          date: normalizedDate,
          bookedCount: 0,
          maxCapacity: doctor.maxAppointmentsPerDay
        });
      } catch (err) {
        // If two threads try to create the missing schedule at the exact same time, 
        // one will hit a duplicate key error (11000). We just fetch it if that happens.
        if (err.code === 11000) {
           schedule = await DailySchedule.findOne({ doctor: doctor._id, date: normalizedDate });
        } else {
           throw err;
        }
      }
    }

    // 2. THE ATOMIC LOCK: 100% safe on local standalone databases
    const updatedSchedule = await DailySchedule.findOneAndUpdate(
      { 
        _id: schedule._id, 
        bookedCount: { $lt: schedule.maxCapacity } 
      },
      { $inc: { bookedCount: 1 } },
      { new: true }
    );

    // If it returns null, another thread beat us to the last slot
    if (!updatedSchedule) {
      throw { err: "Doctor is fully booked for this day. Please choose another date.", code: 400 };
    }

    // 3. Slot secured. Create the appointment.
    const response = await Appointment.create(data);
    return response;

  } catch (error) {
    if (error.name === "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => { err[key] = error.errors[key].message; });
      throw { err, code: 422 };
    }
    throw error.err ? error : { err: error.message || "Internal Server Error", code: 500 };
  }
};

const getAppointments = async (data) => {
  try {
    let query = {};

    if (data?.paymentStatus) {
      query.paymentStatus = data.paymentStatus;
    }

    if (data?.userName || data?.email || data?.mob_no) {
      let userQuery = {};

      if (data?.userName) {
        userQuery.name = { $regex: data.userName, $options: "i" };
      }

      if (data?.email) {
        userQuery.email = { $regex: data.email, $options: "i" };
      }

      if (data?.mob_no) {
        userQuery.mob_no = { $regex: data.mob_no, $options: "i" };
      }

      const users = await User.find(userQuery).select("_id");
      query.user = { $in: users.map((u) => u._id) };
    }

    const appointments = await Appointment.find(query)
      .populate("user", "name email mob_no")
      .populate("doctor")
      .sort({ createdAt: -1 });

    return appointments;
  } catch (error) {
    throw error;
  }
};

const getAppointmentsByUserID = async (userId, filters) => {
  try {
    const { paymentStatus } = filters;
    let query = { user: userId };

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    const appointments = await Appointment.find(query)
      .populate({
        path: "doctor",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .sort({ createdAt: -1 });

    return appointments;
  } catch (error) {
    throw error;
  }
};

const fetchAppointmentById = async (id) => {
  try {
    const appointment = await Appointment.findById(id)
      .populate("user", "name email mob_no")
      .populate("doctor");

    if (!appointment) {
      throw { err: "Appointment not found", code: 404 };
    }
    return appointment;
  } catch (error) {
    throw error;
  }
};

const updateStatus = async (id, status) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { paymentStatus: status },
      { new: true }
    );
    if (!appointment) {
      throw { err: "Appointment not found", code: 404 };
    }
    return appointment;
  } catch (error) {
    throw error;
  }
};

const deleteAppointment = async (id) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(id);
    if (!appointment) {
      throw { err: "Appointment not found", code: 404 };
    }
    return appointment;
  } catch (error) {
    throw error;
  }
};

const countAll = async () => {
  return await Appointment.countDocuments();
};

const countByStatus = async (status) => {
  return await Appointment.countDocuments({ paymentStatus: status });
};

const checkForAppointmentCount = async (doctorId, dateOfAppointment) => {
  try {
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) throw { err: "Doctor not found", code: 404 };
    
    // Updated to check the DailySchedule directly for maximum accuracy
    const schedule = await DailySchedule.findOne({ 
      doctor: doctorId, 
      date: dateOfAppointment 
    });

    if (!schedule) return true; // No bookings exist yet, so it is available
    
    return schedule.bookedCount < doctor.maxAppointmentsPerDay;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentsByUserID,
  fetchAppointmentById,
  updateStatus,
  deleteAppointment,
  countAll,
  countByStatus,
  checkForAppointmentCount,
};