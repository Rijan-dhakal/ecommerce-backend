import bcrypt from "bcryptjs";
import { error } from "../utils/error.js";
import User from "../models/user.model.js";
import { issueJwt } from "../utils/jwtUtils.js";
import Otp from "../models/otp.model.js";
import sendEmail from "../utils/sendEmail.js";

export const signup = async (req, res, next) => {
  
  try {
    const { username, email, password } = req.body || {};

    if(!username || !email || !password) {
      throw error("Username, email and password are required", 400);
    }
    if (username.length < 3 || username.length > 20) {
      throw error("Username must be between 3 and 20 characters", 400);
    }
    if (!/^[a-zA-Z0-9_.-]+$/.test(username  )) {
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
      throw error("User already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ username, email, password: hashedPassword });
    if (!newUser) throw error("User creation failed", 500);

    const otp = Math.floor(Math.random() * 900000 + 100000);

    const createdOtp = await Otp.create({userId: newUser._id, otp, status: 'unverified'})
    if (!createdOtp) throw error("Failed to perform otp operation")

    const jwt =  issueJwt(newUser, createdOtp, '15m')
    if(!jwt) throw error('Failed to generate jwt')

    createdOtp.status = 'semiverified';  // Update the status field
    await createdOtp.save();

    sendEmail(newUser.email, {
      username: newUser.username,
      otp
    });

    res.cookie('token', jwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 15,
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