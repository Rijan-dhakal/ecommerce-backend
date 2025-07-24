import { error } from "../utils/error.js";
import jwt from "jsonwebtoken"


export const authorize = async (req, res, next) => {
    try {
        const token = req.cookies?.token;
        if (!token) throw error("Authentication token not found");

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.userId) throw error("Invalid token");

        req.user = decoded

        next()
        
    } catch (error) {
        res.status(401).json({success: false, message: "Unauthorized" });
    }
}