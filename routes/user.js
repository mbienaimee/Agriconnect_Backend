import express from "express";
const userRouter = express.Router();
import userControllers from "../Controllers/user.js";
import allValidation from "../utils/validation.js";
// import checkUsers from "../middleware/authorisation.js";

userRouter.post('/signUp',userControllers.signUp);
userRouter.post('/signIn',userControllers.signIn);
userRouter.post('/verify',userControllers.validateOtp);
userRouter.post('/forgotPassword',userControllers.forgotPassword);
userRouter.post('/resetPassword',userControllers.resetPassword);
userRouter.delete('/delete/:id',userControllers.deleteUser);

export default userRouter;