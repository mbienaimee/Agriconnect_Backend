import userModel from "../models/user.js";
import NotFoundError from "../Errors/NotFoundError.js";
import BadRequestError from "../Errors/BadRequestError.js";
import { validationResult} from "express-validator";
import asyncWrapper from "../middleware/async.js";
import jwt from "jsonwebtoken"
import Token from '../models/authToken.js';
import dotenv from "dotenv"
dotenv.config()
import otpGenerator from "../utils/otp.js";
import sendEmail from '../utils/sendEmail.js';
import bcrypt from 'bcrypt';
import UnauthorizedError from '../Errors/UnAuthorisedError.js';
// import { serveWithOptions } from 'swagger-ui-express';
import { json } from 'express';


const signUp = asyncWrapper(async (req, res, next) => {
    //validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    };
    //checking if  the user is already in using the email
    const foundUser = await userModel.findOne({ email: req.body.email });
    if (foundUser) {
        return next(new BadRequestError("Email already in use"));
    };
    //hashing the password
    const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
    //Generate the otp
    const otp = otpGenerator();
    const otpExpirationDate = new Date().getTime() + (60 * 1000 * 5)
    //Recording the user to the database
    const newUser = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
        password: hashedPassword,
        otp: otp,
        otpExpires: otpExpirationDate,
    });

    const savedUser = await newUser.save();
    sendEmail(req.body.email, "Verify your account", `Your otp is ${otp}`);
    if (savedUser) {
        return res.status(201).json({
            message: "user account created!",
            user: savedUser
        });
    }
});
const validateOtp = asyncWrapper(async (req, res, next) => {
    //validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
    //checking if the given otp is stored in the database
    const foundUser = await userModel.findOne({ otp: req.body.otp });
    if (!foundUser) {
        next(new UnauthorizedError('Authorization is denied'));
    }
    //checking if the otp is expired or not.
    if (foundUser.otpExpires < new Date().getTime()) {
        next(new UnauthorizedError('otp expired'));
    }

    //updating a user to be verified
    foundUser.verified = true;
    const savedUser = await foundUser.save();
    if (savedUser ) {
        return res.status(201).json({
            message: "user account verified",
            user: savedUser 
        });
    }
});
const signIn = asyncWrapper(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }

    // find user
    const foundUser = await userModel.findOne({ email: req.body.email });
    if (!foundUser) {
        return next(new BadRequestError("Invalid email or password!"));
    };

    //check account verification
    if (!foundUser.verified) {
        return next(new BadRequestError("Your account is not verified!"));
    }

    //verify password
    const isPasswordVerfied = await bcrypt.compareSync(req.body.password, foundUser.password);
    if (!isPasswordVerfied) {
        return next(new BadRequestError("Invalid email or password!"));
    }
    //generate token
    const token = jwt.sign({ id: foundUser._id, email: foundUser.email }, process.env.JWT_SECRET, { expiresIn: "3h" });
    const options = {
        expiresIn: "3h",
        httpOnly: true
    };

    res.status(200).cookie("token", token, options).json({
        message: "User logged in!",
        token: token,
        user: foundUser
    })
});
const forgotPassword = asyncWrapper(async (req, res, next) => {
    //validate
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new BadRequestError(errors.array()[0].msg));
    }
    //find user
    const foundUser = await userModel.findOne({ email: req.body.email });
    if (!foundUser) {
        return next(new BadRequestError("Your email is not registered!"));
    };
    //Generate token
    const token = jwt.sign({ id: foundUser.id }, process.env.JWT_SECRET, { expiresIn: "3h" });

    //Recording the token to the database
    await Token.create({
        token: token,
        user: foundUser._id,
        expirationDate: new Date().getTime() + (60 * 1000 * 30),
    });
    const link = `http://localhost:4000/reset-password?token=${token}&id=${foundUser.id}`;
    const emailBody = `Click on the link bellow to reset your password\n\n${link}`;

    await sendEmail(req.body.email, "Reset your password", emailBody);

    res.status(200).json({
        message: "We sent you a reset password link on your email!",
    });
});

const resetPassword = asyncWrapper(async (req,res,next) => {
    const { token, id, password } = req.body;

    // Validate input
    if (!token || !id || !password) {
        return next(new BadRequestError("Token, id, and new password are required."));
    }

    // Verify token
    const foundToken = await Token.findOne({token});
    if (!foundToken) {
        return next(new BadRequestError("Invalid or expired token."));
    }

    // Update user's password
    const foundUser = await userModel.findById(id);
    if (!foundUser) {
        return next(new BadRequestError("Invalid buyer."));
    }

    // Update user's password
    foundUser.password = password;
    await foundUser.save();

    // Delete token from database
    await Token.deleteOne({token});

    res.status(200).json({
        message: "Password reset successful.",
    });
});

const deleteUser = asyncWrapper(async (req, res, next) => {
    const id = req.params.id;
    const user = await userModel.findByIdAndDelete(id);
    if (!user) {
        return next(createCustomerError(`No user with id ${id}`, 404));
    }
    res.status(200).json({ message: 'User deleted' });
});


const userControllers = {
    signUp,
    signIn,
    validateOtp,
    forgotPassword,
    resetPassword,
    deleteUser
};
export default userControllers;