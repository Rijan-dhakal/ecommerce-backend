import { error } from "../utils/error.js";
import User from "../models/user.model.js";
import { issueJwt } from "../utils/jwtUtils.js";
import Otp from "../models/otp.model.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body || {};

    if(!username || !email || !password) {
      throw error("Username, email and password are required", 400);
    }
    if (username.length < 3 || username.length > 20) {
      throw error("Username must be between 3 and 20 characters", 400);
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
      throw error("Username can only contain letters, numbers, underscores, and hyphens", 400);
    }
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      throw error("Invalid email format", 400);
    }
    if (password.length < 6) {
      throw error("Password must be at least 6 characters long", 400);
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      throw error("User already exists try new username or email", 409);
    }

    // password is hashed before saving by the pre-save hook in user.model.js
    const newUser = await User.create({ username, email, password });
    if (!newUser) throw error("User creation failed", 500);

    const otp = Math.floor(Math.random() * 900000 + 100000);

    const createdOtp = await Otp.create({userId: newUser._id, otp, status: 'unverified'})
    if (!createdOtp) throw error("Failed to perform otp operation")

    const jwt =  issueJwt(newUser, '15m', false)
    if(!jwt) throw error('Failed to generate jwt')

    sendEmail(newUser.email, {
      username: newUser.username,
      otp
    }, "otp");

    res.cookie('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: {
        username: newUser.username,
        email: newUser.email,
            _id: newUser._id
          }
        });
  } catch (error) {
      next(error);
  }
};

export const login = async (req, res, next) => {
  try {

    if(!req.body) throw error("Request body is required", 400)

    const { username, email, password } = req.body

    if (!(email || username) || !password) throw error("Email and password are required", 400);

    const user = await User.findOne({$or: [{ username }, { email }] }).select("-isAdmin");
    if (!user) throw error("Invalid credentials", 401);

    if (user.isVerified === false) throw error("User not verified", 403);

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw error("Invalid credentials", 401);

    const jwt = issueJwt(user, '7d', false); // Admin status is always false for regular login
    if (!jwt) throw error("Failed to generate JWT", 500);

    res.cookie('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
        _id: user._id
      }
    });

} catch(err){
  next(err)
}
}

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw error("Email is required", 400);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({success: true, message: 'If the email exists, a reset link will be sent'});
    }

    if (!user.isVerified) throw error("User not verified", 403);

    user.resetToken = crypto.randomBytes(32).toString('hex');
    user.resetTokenExpires = Date.now() + 30 * 60 * 1000; // Token valid for 30 minutes
    await user.save();

    const resetLink = `${process.env.SITE_URL}/reset-password?token=${user.resetToken}`;

    sendEmail(user.email, {
      username: user.username,
      resetLink
    }, "resetPassword");

    res.status(200).json({
      success: true,
      message: 'If the email exists, a reset link will be sent',
    });

  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    
    const { token } = req.query;
    if (!token) throw error("Reset token is required", 400);

    const { newPassword } = req.body;
    if (!token || !newPassword) throw error("Reset token and new password are required", 400);

    const user = await User.findOne({ resetToken: token });
    if (!user) throw error("Invalid reset token", 400);

    await user.resetPassword(newPassword);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });

  } catch (error) {
    next(error)
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) throw error("Old and new passwords are required", 400);

    const user = await User.findById(req.user._id);
    if (!user) throw error("User not found", 404);

    await user.changePassword(oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });

  } catch (error) {
    next(error);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    if(!req.body) throw error("Request body is required", 400);

    const { username, email, password } = req.body;

    if (!(email || username) || !password) throw error("Email of Username and password are required", 400);

    const user = await User.findOne({$or: [{ username }, { email }] }); 
    if (!user) throw error("Invalid credentials", 401);

    if (user.isVerified === false) throw error("User not verified", 403);
    if (!user.isAdmin) throw error("Access denied. Admin privileges required", 403);

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) throw error("Invalid credentials", 401);

    const jwt = issueJwt(user, '7d', true); // True for admin login
    if (!jwt) throw error("Failed to generate JWT", 500);

    res.cookie('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      user: {
        username: user.username,
        email: user.email,
        _id: user._id,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    next(error);
  }
};
