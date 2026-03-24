const { errorResponseBody } = require("../utils/responseBody");

const validateCreateDoctorRequest = async(req,res,next) => {
    
    if(!req.body.name) {
        errorResponseBody.err = "Please provide name";
        return res.status(400).json(errorResponseBody);
    }

    if(!req.body.fees) {
        errorResponseBody.err = "Please provide fees";
        return res.status(400).json(errorResponseBody);
    }

    if(!req.body.description) {
        errorResponseBody.err = "Please provide description";
        return res.status(400).json(errorResponseBody);
    }

    if(!req.body.qualification) {
        errorResponseBody.err = "Please provide qualification";
        return res.status(400).json(errorResponseBody);
    }

    if(!req.body.maxAppointmentsPerDay) {
        errorResponseBody.err = "Please provide maxAppointmentsPerDay";
        return res.status(400).json(errorResponseBody);
    }
    next();
}

module.exports = {
    validateCreateDoctorRequest
}