import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();



export default function connectDB() {
    mongoose.connect(`mongodb+srv://Reine:2Ip1RgTpAFlgITEj@cluster0.fslpg5p.mongodb.net/Agri-connect`)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));
};
 