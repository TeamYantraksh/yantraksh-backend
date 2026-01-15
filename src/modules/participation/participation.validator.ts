import { z } from "zod";

export const participationIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Participation id is required"),
  }),
});

export const createParticipationSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "userId is required"),
    competitionId: z.string().min(1, "competitionId is required"),
    teamId: z.string().min(1).optional(),
  }),
});

export const updateParticipationSchema = z.object({
  body: z.object({
    teamId: z.string().min(1).optional().nullable(),
  }),
});

