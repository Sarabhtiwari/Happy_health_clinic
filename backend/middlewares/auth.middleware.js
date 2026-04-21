const jwt = require('jsonwebtoken')
const userService = require('../services/user.service')
const { errorResponseBody } = require('../utils/responseBody')

//for signup 
const validateAuthRequest = async (req,res,next) => {
    if(!req.body.name){
        errorResponseBody.err = "Name of the user not present in the request"
        return res.status(400).json(errorResponseBody);
    }

    if(!req.body.email){
        errorResponseBody.err = "Email of the user not present in the request"
        return res.status(400).json(errorResponseBody);
    }
    if(!req.body.password){
        errorResponseBody.err = "password of the user not present in the request"
        return res.status(400).json(errorResponseBody);
    }
    next();
}

//for signin
const validateSignInRequest = async (req,res,next) => {
    if(!req.body.email){
        errorResponseBody.err = "Email of the user not present in the signn in request"
        return res.status(400).json(errorResponseBody);
    }
    if(!req.body.password){
        errorResponseBody.err = "password of the user not present in the sign in request"
        return res.status(400).json(errorResponseBody);
    }
    next();
}

const isAuthenticated = async(req,res,next) => {
    try {
        const authHeader = req.headers["authorization"];
        const cookieToken = req.cookies?.authToken;
        const rawHeaderToken = authHeader?.split(" ")[1];
        const token = cookieToken || rawHeaderToken;

        // console.log('auth middleware:', { cookieToken, rawHeaderToken });

        if (!token) {
            errorResponseBody.err = "No token provided";
            return res.status(403).json(errorResponseBody);
        }
        
        const response = jwt.verify(token, process.env.AUTH_KEY);
        //repsonse will have id of user
        if(!response){
            errorResponseBody.err = "Token not verified"
            return res.status(401).json(errorResponseBody)
        }
        
        const user = await userService.getUserById(response.id);
       
        req.user = user.id;
        next();
    } catch (error) {
        // console.log(error);
        if(error.name == "JsonWebTokenError"){
            errorResponseBody.err = error.message;
            return res.status(401).json(errorResponseBody)
        }
        if(error.code == 404){
            errorResponseBody.err = "No user found for the given id"
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody)
    }
}

module.exports = {
    validateAuthRequest,
    validateSignInRequest,
    isAuthenticated
}