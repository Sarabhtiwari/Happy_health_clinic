const Appointment = require("../models/appointment.model");

const createAppointment = async (data) => {
  try {
    //appointment number generation
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

module.exports = {
  createAppointment,
};
