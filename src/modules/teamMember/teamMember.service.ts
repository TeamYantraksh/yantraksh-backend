import { AppError } from "../../core/AppError";
import TeamMemberRepository from "./teamMember.repository";
import prisma from "../../config/client";

type TeamMemberCreateData = {
  teamId: string;
  userId: string;
};

export class TeamMemberService {
  constructor(private teamMemberRepo: TeamMemberRepository) {}

  async createTeamMember(data: TeamMemberCreateData) {
    const team = await prisma.team.findUnique({
      where: { id: data.teamId },
    });
    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (team.leaderId === data.userId) {
      throw new AppError("Team leader is already part of the team", 409);
    }

    const existingMember = await this.teamMemberRepo.findByTeamAndUser(
      data.teamId,
      data.userId
    );
    if (existingMember) {
      throw new AppError("User is already a member of this team", 409);
    }

    return this.teamMemberRepo.create(data);
  }

  async getAllTeamMembers() {
    return this.teamMemberRepo.findAll();
  }

  async getTeamMemberById(id: string) {
    const teamMember = await this.teamMemberRepo.findById(id);
    if (!teamMember) throw new AppError("Team member not found", 404);
    return teamMember;
  }

  async getTeamMembersByTeam(teamId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!team) {
      throw new AppError("Team not found", 404);
    }
    return this.teamMemberRepo.findByTeam(teamId);
  }

  async getTeamMembersByUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    return this.teamMemberRepo.findByUser(userId);
  }

  async deleteTeamMember(id: string) {
    try {
      await this.teamMemberRepo.deleteById(id);
      return true;
    } catch {
      throw new AppError("Team member not found", 404);
    }
  }

  async deleteTeamMemberByTeamAndUser(teamId: string, userId: string) {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
    });
    if (!team) {
      throw new AppError("Team not found", 404);
    }

    if (team.leaderId === userId) {
      throw new AppError("Cannot remove team leader", 400);
    }

    const result = await this.teamMemberRepo.deleteByTeamAndUser(teamId, userId);
    if (result.count === 0) {
      throw new AppError("User is not a member of this team", 404);
    }

    return true;
  }
}
