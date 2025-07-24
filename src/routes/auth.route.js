import { Router } from "express";
import {  login, logout, signup } from "../controllers/auth.controller.js";
import { otp } from "../controllers/otp.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

 
const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post("/otp", otp);

authRouter.post("/login", login);

authRouter.post("/logout", authorize, logout);


export default authRouter;
