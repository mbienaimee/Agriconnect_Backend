import express from 'express';
const farmerRouter = express.Router();
import farmerControllers from '../Controllers/farmerSignUp.js';
import allValidation from '../utils/validation.js';
// import checkUsers

farmerRouter.post('/signUp',allValidation.signUpValidation,farmerControllers.signUp);
farmerRouter.post('/signIn',allValidation.signInValidation,farmerControllers.SignIn);
farmerRouter.post('/verify',allValidation.otpValidation,farmerControllers.validateOtp);
farmerRouter.post('/forgotPassword',allValidation.forgotPasswordValidation,farmerControllers.forgotPassword);
farmerRouter.post('/resetPassword',allValidation.resetPasswordValidation,farmerControllers.resetPassword);
farmerRouter.delete('/delete/:id',farmerControllers.deleteFarmer);

export default farmerRouter;
