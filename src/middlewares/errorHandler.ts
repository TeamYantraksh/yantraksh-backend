import { AppError } from "../core/AppError";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
    console.error("🔥 Error:", err);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            error: err.message,
        });
    }

    return res.status(500).json({
        success: false,
        error: "Internal server error",
    });
};
