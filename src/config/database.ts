import mongoose from "mongoose";
import prisma from "./client";

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL!)
        console.log("Mongoose connected")

        await prisma.$connect()
        console.log("Prisma connected")
    } catch (error:any) {
        console.log("DB Error",error)
        process.exit(1)
    }
}