import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
    (schema: ZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });
                next();
            } catch (err) {
                if (err instanceof ZodError) {
                    return res.status(422).json({
                        success: false,
                        errors: err.issues.map((e) => ({
                            field: e.path.join("."),
                            message: e.message,
                        })),
                    });
                }
                next(err);
            }
        };
