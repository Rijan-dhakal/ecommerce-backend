import Otp from "../models/otp.model.js";
import User from "../models/user.model.js";

export const cleanupExpiredUsers = async function () {
  try {
    const expiredOTPs = await Otp.find({
      status: "unverified",
      expiresIn: { $lt: new Date(Date.now()) }, // Check for expired OTPs
    });

    const userIds = expiredOTPs.map((o) => o.userId);
    const otpIds = expiredOTPs.map((o) => o._id);

    const userDeleteResult = await User.deleteMany({ _id: { $in: userIds } });
    const otpDeleteResult = await Otp.deleteMany({ _id: { $in: otpIds } });

    console.log(
      `${userDeleteResult.deletedCount} users and ${otpDeleteResult.deletedCount} OTP removed.`
    );
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

export const cleanupExpiredResetTokens = async function () {
  try {
    const result = await User.updateMany(
      {
        resetToken: { $exists: true },
        resetTokenExpires: { $lt: new Date() },
      },
      {
        $unset: {
          resetToken: "",
          resetTokenExpires: "",
        },
      }
    );

    console.log(`${result.modifiedCount} expired reset tokens cleared.`);
  } catch (error) {
    console.error("Error during cleanup of expired reset tokens:", error);
  }
};
