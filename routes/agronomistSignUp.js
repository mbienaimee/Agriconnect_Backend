import express from 'express';
const agronomistRouter = express.Router();
import agronomistControllers from '../Controllers/agronomistSignUp.js';
import allValidation from '../utils/validation.js';
// import checkUsers

agronomistRouter.post('/signUp',allValidation.signUpValidation,agronomistControllers.signUp);
agronomistRouter.post('/signIn',allValidation.signInValidation,agronomistControllers.SignIn);
agronomistRouter.post('/verify',allValidation.otpValidation,agronomistControllers.validateOtp);
agronomistRouter.post('/forgotPassword',allValidation.forgotPasswordValidation,agronomistControllers.forgotPassword);
agronomistRouter.post('/resetPassword',allValidation.resetPasswordValidation,agronomistControllers.resetPassword);
agronomistRouter.delete('/delete/:id',agronomistControllers.  deleteAgronomist);


export default agronomistRouter;
