import { z } from "zod";

export const teamIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Team id is required"),
  }),
});

export const teamIdAndUserIdParamSchema = z.object({
  params: z.object({
    teamId: z.string().min(1, "Team id is required"),
    userId: z.string().min(1, "User id is required"),
  }),
});

export const competitionIdParamSchema = z.object({
  params: z.object({
    competitionId: z.string().min(1, "Competition id is required"),
  }),
});

export const leaderIdParamSchema = z.object({
  params: z.object({
    leaderId: z.string().min(1, "Leader id is required"),
  }),
});

export const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Team name must be at least 2 characters"),
    competitionId: z.string().min(1, "Competition id is required"),
    leaderId: z.string().min(1, "Leader id is required"),
  }),
});

export const updateTeamSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Team name must be at least 2 characters").optional(),
  }),
});

export const addTeamMemberSchema = z.object({
  body: z.object({
    userId: z.string().min(1, "User id is required"),
  }),
});

export const teamIdParamOnlySchema = z.object({
  params: z.object({
    teamId: z.string().min(1, "Team id is required"),
  }),
});
