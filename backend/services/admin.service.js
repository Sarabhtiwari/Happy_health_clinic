const appointmentService = require('./appointment.service'); 
const userService = require('./user.service'); 

const getDashboardStats = async () => {
  try {
    const [totalAppointments, pendingAppointments, totalPatients, totalDoctors] =
      await Promise.all([
        appointmentService.countAll(),
        appointmentService.countByStatus('PENDING'),
        userService.countByRole('PATIENT'),
        userService.countByRole('DOCTOR'),
      ]);

    return { totalAppointments, pendingAppointments, totalPatients, totalDoctors };
  } catch (error) {
    throw error;
  }
};

const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    const allowed = ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];
    if (!allowed.includes(status)) {
      throw { code: 400, err: 'Invalid status value' };
    }
    return await appointmentService.updateStatus(appointmentId, status);
  } catch (error) {
    throw error;
  }
};

const getAllUsers = async (query) => {
  try {
    const { role, page = 1, limit = 10 } = query;
    const filter = role ? { userRole: role } : {};
    return await userService.getAll(filter, page, limit);
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (targetUserId, requestingUserId) => {
  try {
    if (targetUserId === requestingUserId.toString()) {
      throw { code: 400, err: 'Cannot delete yourself' };
    }
    return await userService.deleteById(targetUserId);
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getDashboardStats,
  updateAppointmentStatus,
  getAllUsers,
  deleteUser,
};