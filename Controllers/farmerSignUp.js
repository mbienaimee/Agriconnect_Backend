import farmerModel from "../models/buyerSignUp.js";
import asyncWrapper from "../middleware/async.js";
import bcrypt from 'bcrypt';
import BadRequestError from "../Errors/BadRequestError.js";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken"
import Token from '../models/authToken.js';
import dotenv from "dotenv"
dotenv.config()
import otpGenerator from "../utils/otp.js";
import sendEmail from '../utils/sendEmail.js';
import  UnauthorizedError  from '../Errors/UnAuthorisedError.js';
import { serveWithOptions } from 'swagger-ui-express';
import { json } from 'express';

const signUp = asyncWrapper(async(req,res,next) => {
        //validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new BadRequestError(errors.array()[0].msg));
        };
        //checking if  the user is already in using the email
        const foundFarmer = await farmerModel.findOne({ email: req.body.email });
        if (foundFarmer) {
            return next(new BadRequestError("Email already in use"));
        };
        //hashing the password
        const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
        //Generate the otp
        const otp = otpGenerator();
        const otpExpirationDate = new Date().getTime()+(60*1000*5)
        //Recording the user to the database
        const newFarmer = new farmerModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            role: req.body.role,
            password: hashedPassword,
            otp: otp,
            otpExpires: otpExpirationDate,
        });
    
        const savedFarmer = await newFarmer.save();
        sendEmail(req.body.email, "Verify your account", `Your otp is ${otp}`);
        if (savedFarmer) {
            return res.status(201).json({
                message: "user account created!",
                user: savedFarmer
            });
        }
    });
    const validateOtp = asyncWrapper(async(req,res,next) =>{
        //validate
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return next(new BadRequestError(errors.array()[0].msg));
        }
        //checking if the given otp is stored in the database
        const foundFarmer = await farmerModel.findOne({otp: req.body.otp});
        if(!foundFarmer){
            next(new UnauthorizedError('Authorization is denied'));
        }
        //checking if the otp is expired or not.
        if(foundFarmer.otpExpires < new Date().getTime()){
            next(new UnauthorizedError('otp expired'));
        }
    
        //updating a user to be verified
        foundFarmer.verified = true;
        const savedFarmer = await foundFarmer.save();
        if(savedFarmer){
            return res.status(201).json({
                message: "user account verified",
                user: savedFarmer
            });
        }
    });
    const SignIn = asyncWrapper(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new BadRequestError(errors.array()[0].msg));
        }
    
        // find user
        const foundFarmer = await farmerModel.findOne({ email: req.body.email });
        if (!foundFarmer) {
            return next(new BadRequestError("Invalid email or password!"));
        };
    
        //check account verification
        if (!foundFarmer.verified) {
            return next(new BadRequestError("Your account is not verified!"));
        }
    
        //verify password
        const isPasswordVerfied = await bcrypt.compareSync(req.body.password, foundFarmer.password);
        if (!isPasswordVerfied) {
            return next(new BadRequestError("Invalid email or password!"));
        }
        //generate token
        const token = jwt.sign({ id: foundFarmer._id, email: foundFarmer.email }, process.env.JWT_SECRET, { expiresIn: "3h" });
        const options = {
            expiresIn: "3h",
            httpOnly: true
        };
    
        res.status(200).cookie("token",token,options).json({
            message: "User logged in!",
            token: token,
            user: foundFarmer
        })
    });
    const forgotPassword = asyncWrapper(async (req,res,next) => {
        //validate
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return next(new BadRequestError(errors.array()[0].msg));
        }
        //find user
        const foundFarmer = await farmerModel.findOne({ email: req.body.email });
        if (!foundFarmer) {
            return next(new BadRequestError("Your email is not registered!"));
        };
        //Generate token
        const token = jwt.sign({ id: foundFarmer.id }, process.env.JWT_SECRET, { expiresIn: "3h" });
    
        //Recording the token to the database
        await Token.create({
            token: token,
            user: foundFarmer._id,
            expirationDate: new Date().getTime() + (60 * 1000 * 30),
        });
        const link = `http://localhost:4000/reset-password?token=${token}&id=${foundFarmer.id}`;
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
        const foundFarmer = await farmerModel.findById(id);
        if (!foundFarmer) {
            return next(new BadRequestError("Invalid farmer."));
        }
    
        // Update user's password
        foundFarmer.password = password;
        await foundFarmer.save();
    
        // Delete token from database
        await Token.deleteOne({token});
    
        res.status(200).json({
            message: "Password reset successful.",
        });
    });

    const deleteFarmer = asyncWrapper(async (req, res, next) => {
        const id = req.params.id;
            const farmer = await farmerModel.findByIdAndDelete(id);
            if (!farmer) {
                return next(createCustomerError(`No user with id ${id}`, 404));
            }
            res.status(200).json({ message: 'User deleted' });
    });
    

const farmerControllers = {
    signUp,
    SignIn,
    validateOtp,
    forgotPassword,
    resetPassword,
    deleteFarmer
};
export default farmerControllers;
