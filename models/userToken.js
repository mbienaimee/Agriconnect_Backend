import mongoose from "mongoose"
import {model,Schema} from 'mongoose';

const TokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    user:{
        type: String,
        // ref: "user",
        required: true,  
    },
    expirationDate: {
        type: Date,
        required: true,
    }
});
const TokenModel = mongoose.model("token",TokenSchema)
export default TokenModel;