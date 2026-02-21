import { z } from "zod";

export const competitionTypeSchema = z.enum(["SOLO", "TEAM"]);

export const competitionIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Competition id is required"),
  }),
});

export const createCompetitionSchema = z.object({
  body: z.object({
    title: z.string().min(2),
    category: z.string().min(1),
    prize: z.string(),
    type: competitionTypeSchema,
    image: z.string().url().or(z.string()), // Accept URL or string path
    specs: z.array(z.string()),
    needReg: z.boolean().default(false),
  }),
});

export const updateCompetitionSchema = z.object({
  body: z.object({
    title: z.string().min(2).optional(),
    category: z.string().min(1).optional(),
    prize: z.string().optional(),
    type: competitionTypeSchema.optional(),
    image: z.string().optional(),
    specs: z.array(z.string()).optional(),
    needReg: z.boolean().optional(),
  }),
});

