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
    const pipeline = [];

    // -------------------------------------------------------------
    // STAGE 1: Early Match (Module 1)
    // Filter the appointments natively first to reduce the stream size
    // -------------------------------------------------------------
    const initialMatch = {};
    if (data?.paymentStatus) {
      initialMatch.paymentStatus = data.paymentStatus;
    }
    
    // Only push the $match stage if there is actually something to filter
    if (Object.keys(initialMatch).length > 0) {
      pipeline.push({ $match: initialMatch });
    }

    // -------------------------------------------------------------
    // STAGE 2 & 3: The User Join & Unwind (Modules 7 & 3)
    // -------------------------------------------------------------
    pipeline.push(
      {
        $lookup: {
          from: "users",          // The actual MongoDB collection name
          localField: "user",     // The field in Appointment
          foreignField: "_id",    // The field in User
          as: "user"
        }
      },
      {
        // Unwind to fix the "Array Return Trap" from $lookup
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true }
      }
    );

    // -------------------------------------------------------------
    // STAGE 4: Dynamic User Search (Module 1 applied post-join)
    // If they typed a name/email, we filter the stream NOW, after the join
    // -------------------------------------------------------------
    const userMatch = {};
    if (data?.userName) {
      userMatch["user.name"] = { $regex: data.userName, $options: "i" };
    }
    if (data?.email) {
      userMatch["user.email"] = { $regex: data.email, $options: "i" };
    }
    if (data?.mob_no) {
      userMatch["user.mob_no"] = { $regex: data.mob_no, $options: "i" };
    }

    if (Object.keys(userMatch).length > 0) {
      pipeline.push({ $match: userMatch });
    }

    // -------------------------------------------------------------
    // STAGE 5 & 6: The Doctor Join
    // -------------------------------------------------------------
    pipeline.push(
      {
        $lookup: {
          from: "doctors",       // The actual MongoDB collection name
          localField: "doctor",
          foreignField: "_id",
          as: "doctor"
        }
      },
      {
        $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true }
      },
      // -------------------------------------------------------------
      // NEW: STAGE 6.5: The Nested Doctor -> User Join
      // We must fetch the doctor's linked 'user' document to get their name
      // -------------------------------------------------------------
      {
        $lookup: {
          from: "users",
          localField: "doctor.user", // The ObjectId stored inside the doctor document
          foreignField: "_id",
          as: "doctorUserDetails"
        }
      },
      {
        $unwind: { path: "$doctorUserDetails", preserveNullAndEmptyArrays: true }
      },
      {
        $set: {
          "doctor.user": "$doctorUserDetails" // Attach the populated user so frontend can do appt.doctor.user.name
        }
      },
      {
        $unset: "doctorUserDetails" // Cleanup the temporary field
      }
    );

    // -------------------------------------------------------------
    // STAGE 7: Shape Shifting (Module 2)
    // Replicating Mongoose's .populate("user", "name email mob_no")
    // We overwrite the bulky user object with exactly what the frontend needs
    // -------------------------------------------------------------
    pipeline.push({
      $set: {
        user: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          mob_no: "$user.mob_no"
        }
        // You can do the same for 'doctor' here if you want to hide their private data!
      }
    });

    // -------------------------------------------------------------
    // STAGE 8: Sort (Module 1)
    // -------------------------------------------------------------
    pipeline.push({ $sort: { createdAt: -1 } });

    // Execute the pipeline
    const appointments = await Appointment.aggregate(pipeline);
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