import {z} from "zod";

export const competitionTypeSchema = z.enum(["SOLO", "TEAM"]);

export const competitionIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Competition id is required"),
  }),
});

export const createCompetitionSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    type: competitionTypeSchema,
    prize: z.number().int().nonnegative(),
  }),
});

export const updateCompetitionSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    type: competitionTypeSchema.optional(),
    prize: z.number().int().nonnegative().optional(),
  }),
});

