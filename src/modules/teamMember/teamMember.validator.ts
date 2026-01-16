import { z } from "zod";

export const teamMemberIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "Team member id is required"),
  }),
});

export const teamIdParamSchema = z.object({
  params: z.object({
    teamId: z.string().min(1, "Team id is required"),
  }),
});

export const userIdParamSchema = z.object({
  params: z.object({
    userId: z.string().min(1, "User id is required"),
  }),
});

export const teamIdAndUserIdParamSchema = z.object({
  params: z.object({
    teamId: z.string().min(1, "Team id is required"),
    userId: z.string().min(1, "User id is required"),
  }),
});

export const createTeamMemberSchema = z.object({
  body: z.object({
    teamId: z.string().min(1, "Team id is required"),
    userId: z.string().min(1, "User id is required"),
  }),
});
