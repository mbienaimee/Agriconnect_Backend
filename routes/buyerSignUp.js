import express from 'express';
const buyerRouter = express.Router();
import buyerControllers from '../Controllers/buyerSignup.js';
import allValidation from '../utils/validation.js';
// import checkUsers

buyerRouter.post('/signUp',allValidation.signUpValidation,buyerControllers.signUp);
buyerRouter.post('/signIn',allValidation.signInValidation,buyerControllers.SignIn);
buyerRouter.post('/verify',allValidation.otpValidation,buyerControllers.validateOtp);
buyerRouter.post('/forgotPassword',allValidation.forgotPasswordValidation,buyerControllers.forgotPassword);
buyerRouter.post('/resetPassword',allValidation.resetPasswordValidation,buyerControllers.resetPassword);
buyerRouter.delete('/delete/:id',buyerControllers.deleteBuyer);


export default buyerRouter;
