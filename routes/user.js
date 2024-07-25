import express from "express";
const userRouter = express.Router();
import userControllers from "../Controllers/user.js";
import allValidation from "../utils/validation.js";
// import checkUsers from "../middleware/authorisation.js";

userRouter.post('/signUp',allValidation.signUpValidation,userControllers.signUp);
userRouter.post('/signIn',allValidation.signInValidation,userControllers.signIn);
userRouter.post('/verify',allValidation.otpValidation,userControllers.validateOtp);
userRouter.post('/forgotPassword',allValidation.forgotPasswordValidation,userControllers.forgotPassword);
userRouter.post('/resetPassword',allValidation.resetPasswordValidation,userControllers.resetPassword);
userRouter.delete('/delete/:id',userControllers.deleteUser);

export default userRouter;