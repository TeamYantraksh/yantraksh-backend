import { Response } from "express";
import { AuthRequest } from "../../types/request";
import { AuthService } from "./auth.service";
import { sendEmail } from "../mail/mail.service";
import prisma from "../../config/client";
import jwt from 'jsonwebtoken'

const service = new AuthService();

export class AuthController {
    async register(req: AuthRequest, res: Response) {
        const token = await service.register(req.body)
        return res.json({ token })
    }

    async login(req: AuthRequest, res: Response) {
        const token = await service.login(req.body)
        return res.json({ token })
    }

    async me(req: AuthRequest, res: Response) {
        const user = await service.me(req.user!.id)
        return res.json(user)
    }

    async getAllUsers(req: AuthRequest, res: Response) {
        try {
            const users = await service.getAllUsers();
            return res.json(users);
        } catch (error: any) {
            console.error("DEBUG Error in getAllUsers:", error);
            return res.status(500).json({
                success: false,
                error: error.message,
                stack: error.stack // valid for dev debugging
            });
        }
    }

    async changeUserRole(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const { userType } = req.body;

        if (!id || !userType) {
            return res.status(400).json({ msg: "User ID and User Type are required" });
        }

        const updatedUser = await service.changeUserRole(id as string, userType);
        return res.json(updatedUser);
    }

    async verifyEmail(req: AuthRequest, res: Response) {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: "Invalid verification link" });
        }

        try {
            const decoded = jwt.verify(
                token as string,
                process.env.JWT_SECRET!
            ) as any;

            const user = await prisma.user.update({
                where: { id: decoded.userId },
                data: { isEmailVerified: true },
            });

            await sendEmail(
                user.email,
                "Welcome to Tech Fest!",
                "welcome",
                { name: user.name }
            );

            const frontendUrl = process.env.FRONTEND_URL;

            if (!frontendUrl) {
                return res.status(500).json({
                    error: "FRONTEND_URL is not configured",
                });
            }

            return res.redirect(`${frontendUrl}/auth/login?verified=true`);

        } catch {
            return res.status(400).json({ error: "Verification link expired or invalid" });
        }
    }

}