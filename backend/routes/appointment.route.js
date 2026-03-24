const appointmentController = require('../controllers/appointment.controller')

const route = (app) => {
    app.post('/hhc/api/v1/appointment',appointmentController.createAppointments);
}

module.exports = route;