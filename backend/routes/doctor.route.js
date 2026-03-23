const doctorController = require('../controllers/doctor.controller')

const route = (app) => {
    app.post('/hhc/api/v1/doctor',doctorController.createDocs);
}

module.exports = route;