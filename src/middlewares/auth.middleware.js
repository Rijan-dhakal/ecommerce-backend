import { error } from "../utils/error.js";
import jwt from "jsonwebtoken"
import User from "../models/user.model.js";


export const authorize = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) throw error("Authentication token not found");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) throw error("Invalid token");

        if (!decoded?.isVerified) throw error("User not verified", 403);

        // Verify user exists in database
        const user = await User.findById(decoded.userId);
        if (!user) throw error("Unauthorized", 404);

        // Attach user info to request object
        req.user = {
            _id: decoded.userId,
            email: decoded.email,
            isVerified: decoded.isVerified,
            isAdmin: decoded.isAdmin, 
            username: user.username 
        };

        next()
        
    } catch (error) {
        res.status(401).json({success: false, message: "Unauthorized" });
    }
}

export const isAdmin = async (req, res, next) => {
    try {
        const {isAdmin} = req.user
        if (!isAdmin) throw error("Access denied. Admin privileges required", 403);
        next();
    } catch (error) {
        res.status(403).json({success: false, message: "Access denied. Admin privileges required" });
    }
}