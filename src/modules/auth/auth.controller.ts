import { Response } from "express";
import { AuthRequest } from "../../types/request";
import { AuthService } from "./auth.service";

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
}