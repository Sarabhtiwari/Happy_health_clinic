const Appointment = require("../models/appointment.model");
const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");

const createAppointment = async (data) => {
  try {
    //logic for if booking with penxding status already exists
    // for the same doctor and date, then throw error
    //appointment number generation
    console.log(data);
    const startOfDay = new Date(data.dateOfAppointment);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(data.dateOfAppointment);
    endOfDay.setHours(23, 59, 59, 999);

    const last = await Appointment.findOne({
      doctor: data.doctor,
      dateOfAppointment: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ appointmentNo: -1 });

    const appointmentNo = last ? last.appointmentNo + 1 : 1;
    const response = await Appointment.create({
      ...data,
      appointmentNo,
    });

    return response;
  } catch (error) {
    if (error.name == "ValidationError") {
      let err = {};
      Object.keys(error.errors).forEach((key) => {
        err[key] = error.errors[key].message;
      });

      throw { err: err, code: 422 };
    }

    throw error;
  }
};

const getAppointments = async (data) => {
  try {
    let query = {};

    // 1. Basic Filters (Status, Payment, etc.)
    if (data?.status) query.status = data.status;
    if (data?.paymentStatus) query.paymentStatus = data.paymentStatus;
    if (data?.appointmentNo) query.appointmentNo = data.appointmentNo;

    // 2. Date Range Filter (Optional but recommended)
    if (data?.startDate && data?.endDate) {
      query.dateOfAppointment = {
        $gte: new Date(data.startDate),
        $lte: new Date(data.endDate),
      };
    }

    // 3. Filter by User (Patient) Name
    if (data?.userName) {
      const users = await User.find({
        name: { $regex: data.userName, $options: "i" },
      }).select("_id");

      const userIds = users.map((u) => u._id);
      query.user = { $in: userIds };
    }

    // 4. Filter by Doctor Name
    if (data?.doctorName) {
      const doctors = await Doctor.find({
        name: { $regex: data.doctorName, $options: "i" },
      }).select("_id");

      const doctorIds = doctors.map((d) => d._id);
      query.doctor = { $in: doctorIds };
    }

    // 5. Pagination
    const limit = parseInt(data?.limit) || 10;
    const page = parseInt(data?.skip) || 0;
    const skipValue = page * limit;

    // 6. Execute and Populate
    const response = await Appointment.find(query)
      .populate("user", "name email userRole") // Brings in Patient details
      .populate("doctor") // Brings in Doctor details
      .populate("payment")
      .limit(limit)
      .skip(skipValue)
      .sort({ dateOfAppointment: -1 });

    // 7. Get Total Count (Useful for frontend pagination UI)
    const totalCount = await Appointment.countDocuments(query);

    return {
      appointments: response,
      total: totalCount,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
    };
  } catch (error) {
    console.error("Error in getAppointments:", error);
    throw error;
  }
};

const getAppointmentById = async (id) => {
  try {
    const response = await Appointment.findById(id)
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name' } 
      })
      .populate('user', 'name email'); 
      
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  } 
};

module.exports = {
  createAppointment,
  getAppointments,
  getAppointmentById,
};
