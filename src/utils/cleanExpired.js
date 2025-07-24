import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";

export const cleanupExpiredUsers = async function() {
    try {
        const expiredOTPs = await Otp.find({
            status: { $in: ["unverified", "semiverified"] },
            expiresIn: { $lt: new Date(Date.now() + 16 * 60 * 1000) } 
        });

        const userIds = expiredOTPs.map(o => o.userId);
        const otpIds = expiredOTPs.map(o => o._id);

        const userDeleteResult = await User.deleteMany({ _id: { $in: userIds } });
        const otpDeleteResult = await Otp.deleteMany({ _id: { $in: otpIds } });
        
        console.log(`${userDeleteResult.deletedCount} users and ${otpDeleteResult.deletedCount} OTPs removed.`);

    } catch (error) {
        console.error('Error during cleanup:', error);
    }
};