import { Router } from "express";
import {  login, logout, signup, forgotPassword, resetPassword, changePassword } from "../controllers/auth.controller.js";
import { otp } from "../controllers/otp.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

 
const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post("/otp", otp);

authRouter.post("/login", login);

authRouter.post("/logout", authorize, logout);

// Send reset password email
authRouter.post("/forgot-password", forgotPassword);

// Reset password with token
authRouter.post("/reset-password/:resetToken", resetPassword);

authRouter.post("/change-password", authorize, changePassword);


export default authRouter;
