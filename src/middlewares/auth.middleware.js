import { error } from "../utils/error.js";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";


export const authorize = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) throw error("Authentication token not found");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) throw error("Invalid token");

        if (!decoded?.status) throw error("User not verified", 403);

        const user = await User.findById(decoded.userId).select("-password -__v -resetToken -resetTokenExpires -profilePicture -createdAt -updatedAt");
        if (!user) throw error("Unauthorized", 404);



        req.user = user;

        next()
        
    } catch (error) {
        res.status(401).json({success: false, message: "Unauthorized" });
    }
}