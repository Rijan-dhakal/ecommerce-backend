import jwt from "jsonwebtoken";
import { error } from "../utils/error.js";
import Otp from "../models/otp.model.js";

export const otp = async (req, res, next) => {
  try {

    const token = req.cookies?.token;
    if (!token) error("Cookies not found");

    const { otp } = req.body || {};
    if (!otp) error("OTP not found");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) error("Invalid token");

    const { userId, otpId } = decoded;
    if (!userId || !otpId) error("Invalid token payload");

    const respOtp = await Otp.findOne({ userId });
    if (!respOtp) error("OTP not found");

    if (respOtp.status === "verified") {
      return res.status(200).json({ message: "OTP already verified" });
    }

    if (respOtp.status === "semiverified") {
      if (respOtp.otp !== otp) error("Invalid OTP");
      respOtp.status = "verified";
      respOtp.otp = null;
      await respOtp.save();
      return res.status(200).json({ message: "OTP verified successfully" });
    }
    
  } catch (error) {
    next(error);
  }
};
