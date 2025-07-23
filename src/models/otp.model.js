import mongoose from "mongoose";
 
const otpSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    otp:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum:['unverified', 'semiverified', 'verified'],
        default: 'unverified'
    },
    expiresIn:{
        type: Date,
        default: () => new Date(Date.now() + 15 * 60 * 1000),
    },
    
}, {timestamps: true});

const Otp = mongoose.model("Otp", otpSchema);

export default Otp;