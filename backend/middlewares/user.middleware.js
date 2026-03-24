const { errorResponseBody } = require("../utils/responseBody");

const validateCreateUserRequest = async(req,res,next) => {
    
    if(!req.body.name) {
        errorResponseBody.err = "Please provide name";
        return res.status(400).json(errorResponseBody);
    }

    if(!req.body.email) {
        errorResponseBody.err = "Please provide email";
        return res.status(400).json(errorResponseBody);
    }

    if(!req.body.password) {
        errorResponseBody.err = "Please provide password";
        return res.status(400).json(errorResponseBody);
    }
    next();
}

module.exports = {
    validateCreateUserRequest
}