const doctorService = require('../services/doctor.service');
const { successResponseBody, errorResponseBody } = require('../utils/responseBody');

const createDocs = async(req,res) => {
    try {
        const response = await doctorService.createDoctor(req.body);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the doctor";
        return res.status(201).json(successResponseBody);
    } catch (error) {
        console.log(error);
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
};

module.exports = {
    createDocs
}