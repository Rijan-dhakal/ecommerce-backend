import { Router } from "express";
import { signup } from "../controllers/auth.controller.js";
import { otp } from "../controllers/otp.controller.js";
 
const authRouter = Router();

authRouter.post("/signup", signup);

authRouter.post("/otp", otp);

export default authRouter;
