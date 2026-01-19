import { z } from "zod";

export const registerSchema = z.object({
    body: z.object({
        name: z.string().min(1),
        email: z.email(),
        password: z.string().min(6),
        role: z.enum(["AUS_STUDENT", "NON_AUS", "ADMIN", "ORGANIZER", "VOLUNTEER"]),
        rollNumber: z.string().optional(),
        department: z.string().optional(),
        year: z.number().optional(),
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.email(),
        password: z.string().min(6),
    })
});
