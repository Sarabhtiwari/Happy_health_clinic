const userService = require('../services/user.service');
const { successResponseBody, errorResponseBody } = require('../utils/responseBody');
const jwt = require('jsonwebtoken')

const signup = async(req,res) => {
    try {
        const response = await userService.createUser(req.body);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the user";
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

const signin = async(req,res) => {
    try {
        const user = await userService.getUserByEmail(req.body.email);

        const isValidPassword = await user.isValidPassword(req.body.password);

        if(!isValidPassword){
            throw {err: "Invalid  password for the given email", code: 401} 
        }

        const token = jwt.sign({id: user.id,email: user.email} , process.env.AUTH_KEY, {expiresIn: '1h'})

        // console.log(jwt.verify(token,process.env.AUTH_KEY)) must see this //iat and eat
        successResponseBody.message = "Successfuully logged in";
        successResponseBody.data = {
            email: user.email,
            role: user.userRole,
            token: token
        }
        return res.status(200).json(successResponseBody)

    } catch (error) {
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody)
        }
        console.log(error)
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody)
    }
}

module.exports = {
    signup,
    signin
}