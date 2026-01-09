import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/database";
import authRoutes from './src/modules/auth/auth.route'
import { errorHandler } from "./src/middlewares/errorHandler";

dotenv.config()

const app: Application = express()

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Backend is active" })
});

app.use("/auth", authRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    });
};

startServer()