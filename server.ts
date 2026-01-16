import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/database";
import authRoutes from './src/modules/auth/auth.route'
import { errorHandler } from "./src/middlewares/errorHandler";
import merchRoutes from './src/modules/merch/merch.route'
import competitionRoutes from "./src/modules/competition/competition.route";
import participationRoutes from "./src/modules/participation/participation.route";
import teamRoutes from "./src/modules/team/team.route";
import teamMemberRoutes from "./src/modules/teamMember/teamMember.route";
import job from "./src/config/cron";

dotenv.config()

const app: Application = express()

job.start()
app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Backend is active" })
});

app.use("/auth", authRoutes)
app.use("/merch", merchRoutes)
app.use("/competitions", competitionRoutes)
app.use("/participations", participationRoutes)
app.use("/teams", teamRoutes)
app.use("/team-members", teamMemberRoutes)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    });
};

startServer()