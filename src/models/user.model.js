import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { error } from "../utils/error.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    cartData: {
        type: Object,
        default: {}
    },
    resetToken: {
        type: String,
    },
    resetTokenExpires: {
        type: Date,
    },
}, {
    timestamps: true,
    minimize: false
})


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changePassword = async function (newPassword) {
    const isMatch = await this.comparePassword(newPassword);
    if (!isMatch) throw error('Current password is incorrect', 400);
    this.password = newPassword;
    await this.save();
}

userSchema.methods.resetPassword = async function (newPassword) {
    this.password = newPassword;
    this.resetToken = undefined;
    this.resetTokenExpires = undefined;
    await this.save();
}

const User = mongoose.model('User', userSchema);

export default User;