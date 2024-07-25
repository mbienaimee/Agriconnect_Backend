import dotenv from 'dotenv';
dotenv.config();
import express, { Router } from 'express';
import cors from "cors";
import connectDB from './db/connectDB.js';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
// Add assert for JSON import
import swagger from './docs/swagger.json'

const corsOptions = {
    allowedHeaders: ["Authorization", "Content-Type"],
    methods: ["GET", "POST", "PUT", "UPDATE", "DELETE"],
    origin: "*",
};

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use('/api/agri-sales', router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swagger));

const start = async () => {
    try {
        await connectDB();
        app.listen(process.env.PORT, () => console.log(`Server is listening on port ${process.env.PORT}`));
    } catch (error) {
        console.error(error);
    }
};

start();
