import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
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
        enum: ['Farmer', 'Buyer']
    },
    password: {
        type: String,
        required: true
    },
    otp: {
        type: Number,
        required: false
    },
    otpExpires: {
        type: Date,
        required: false
    },
    verified: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    timestamps: true 

    },

);

const userModel = mongoose.model('User', userSchema);
export default userModel;
