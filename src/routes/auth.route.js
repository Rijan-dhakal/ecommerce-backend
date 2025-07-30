import { Router } from "express";
import {  login, logout, signup, forgotPassword, resetPassword, changePassword, adminLogin } from "../controllers/auth.controller.js";
import { otp } from "../controllers/otp.controller.js";
import { authorize, isAdmin } from "../middlewares/auth.middleware.js";

 
const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post("/otp", otp);

authRouter.post("/login", login);

// admin login
authRouter.post("/admin-login", adminLogin);

authRouter.post("/logout", authorize, logout);

// Send reset password email
authRouter.post("/forgot-password", forgotPassword);

// Reset password with token
authRouter.post("/reset-password", resetPassword);

// change password
authRouter.post("/change-password", authorize, changePassword);

authRouter.get("/test", authorize, isAdmin, (req, res) => {
    res.status(200).json({ success: true, message: "You are an admin" });
});


export default authRouter;
