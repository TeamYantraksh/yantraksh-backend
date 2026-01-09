import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/request";
import { Response, NextFunction } from "express";
import { IAuthToken } from "../types/auth";

export const requireUser = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ msg: "Unauthorized" })

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET!) as IAuthToken
        next()
    } catch {
        return res.status(401).json({ msg: "Invalid token" })
    }
};
