const userService = require('../services/user.service');
const { successResponseBody, errorResponseBody } = require('../utils/responseBody');
const jwt = require('jsonwebtoken')

const signup = async(req,res) => {
    try {
        const data = {...req.body, userRole: "PATIENT"};
        const response = await userService.createUser(data);
        successResponseBody.data = response;
        successResponseBody.message = "Successfully created the user";
        return res.status(201).json(successResponseBody);
    } catch (error) {
        // console.log(error);
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
            throw {err: "Incorrect email or password", code: 401};
        }

        const token = jwt.sign({id: user.id,email: user.email} , process.env.AUTH_KEY, {expiresIn: '1h'});

        res.cookie('authToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            path: '/',
            maxAge: 3600000,
        });

        successResponseBody.message = "Successfully logged in";
        successResponseBody.data = {
            email: user.email,
            role: user.userRole,
            name: user.name,
        };
        return res.status(200).json(successResponseBody);

    } catch (error) {
        // console.log(error);
        if(error.err){
            errorResponseBody.err = error.err;
            return res.status(error.code).json(errorResponseBody);
        }
        errorResponseBody.err = error;
        return res.status(500).json(errorResponseBody);
    }
};

const signout = async (req, res) => {
    res.cookie('authToken', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        path: '/',
        expires: new Date(0),
    });

    successResponseBody.message = 'Successfully logged out';
    successResponseBody.data = {};
    return res.status(200).json(successResponseBody);
};

const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                err: 'Not authenticated'
            });
        }

        const user = await userService.getUserById(req.user);

        return res.status(200).json({
            success: true,
            message: 'Authenticated',
            data: {
                email: user.email,
                role: user.userRole,
                name: user.name,
            }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            err: error.message || error
        });
    }
};

module.exports = {
    signup,
    signin,
    signout,
    getCurrentUser,
};