import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: true
    },
    otpExpires: {
        type: Date,
        required: false
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true 

    },

);

const userModel = mongoose.model('User', userSchema);
export default userModel;
