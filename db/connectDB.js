import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();



export default function connectDB() {
    mongoose.connect(`mongodb+srv://uwasandrine99:sandrine99@cluster0.ktffyo9.mongodb.net/AGRI-SALES`)
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err));
};
 