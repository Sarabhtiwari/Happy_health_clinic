const adminService = require('../services/admin.service');
const { successResponseBody, errorResponseBody } = require('../utils/responseBody');

// ─── DASHBOARD STATS ─────────────────────────────────────────────────────────
const getDashboardStats = async (req, res) => {
  try { 
    const response = await adminService.getDashboardStats();
    successResponseBody.data = response;
    successResponseBody.message = "Successfully fetched dashboard statistics";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

// ─── UPDATE APPOINTMENT STATUS ────────────────────────────────────────────────
const updateAppointmentStatus = async (req, res) => {
  try {
    const response = await adminService.updateAppointmentStatus(req.params.id, req.body.status);
    
    successResponseBody.data = response;
    successResponseBody.message = "Successfully updated appointment status";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

// ─── ALL USERS (patients + doctors) ──────────────────────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const response = await adminService.getAllUsers(req.query);
    
    successResponseBody.data = response;
    successResponseBody.message = "Successfully fetched all users";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

// ─── DELETE USER ──────────────────────────────────────────────────────────────
const deleteUser = async (req, res) => {
  try {
    // Pass both the target ID and the requester's ID to the service for validation
    await adminService.deleteUser(req.params.id, req.user);
    
    successResponseBody.data = {};
    successResponseBody.message = "User deleted successfully";
    return res.status(200).json(successResponseBody);
  } catch (error) {
    errorResponseBody.err = error.err || error;
    return res.status(error.code || 500).json(errorResponseBody);
  }
};

module.exports = {
  getDashboardStats,
  updateAppointmentStatus,
  getAllUsers,
  deleteUser
};