import jwt from "jsonwebtoken";
import { error } from "../utils/error.js";
import Otp from "../models/otp.model.js";
import { issueJwt } from "../utils/jwtUtils.js";
import User from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";

export const otp = async (req, res, next) => {
  try {

    const token = req.cookies?.token;
    if (!token) throw error("Cookies not found");

    const { otp } = req.body || {};
    if (!otp) throw error("OTP not found");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) throw error("Invalid token");

    const { userId } = decoded;
    if (!userId) throw error("Invalid token payload");

    const respOtp = await Otp.findOne({ userId });
    if (!respOtp) throw error("OTP not found");

    if (respOtp.status === "verified") {
      return res.status(200).json({ success: true, message: "OTP already verified" });
    }

    if (respOtp.status === "unverified") {
      if (respOtp.otp !== otp) throw error("Invalid OTP");

      const user = await User.findById(userId);
      if (!user) throw error("User not found");

      user.isVerified = true;
      await user.save();

      respOtp.status = "verified";
      respOtp.otp = null;
      await respOtp.save();

      const token = issueJwt(user, "7d", false);
      if (!token) throw error("Failed to generate JWT");

      sendEmail(user.email, {
      username: user.username,
    }, "welcome");

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      await Otp.deleteOne({ _id: respOtp._id });
      
      return res.status(200).json({success:true, message: "OTP verified successfully..Logged In", user:{
        _id: user._id,
        username: user.username,
        email: user.email
      } });
    }
    
  } catch (error) {
    next(error);
  }
};
