import { AppError } from "../../core/AppError";
import TeamRepository from "./team.repository";
import prisma from "../../config/client";

type TeamCreateData = {
  name: string;
  competitionId: string;
  leaderId: string;
};

type TeamUpdateData = Partial<Pick<TeamCreateData, "name">>;

export class TeamService {
  constructor(private teamRepo: TeamRepository) {}

  async createTeam(data: TeamCreateData) {
    const competition = await prisma.competition.findUnique({
      where: { id: data.competitionId },
    });
    if (!competition) {
      throw new AppError("Competition not found", 404);
    }

    const leader = await prisma.user.findUnique({
      where: { id: data.leaderId },
    });
    if (!leader) {
      throw new AppError("Leader not found", 404);
    }

    const existingTeams = await this.teamRepo.findByCompetition(data.competitionId);
    const nameExists = existingTeams.some((team) => team.name.toLowerCase() === data.name.toLowerCase());
    if (nameExists) {
      throw new AppError("Team name already exists for this competition", 409);
    }
    return this.teamRepo.create(data);
  }

  async getAllTeams() {
    return this.teamRepo.findAll();
  }

  async getTeamById(id: string) {
    const team = await this.teamRepo.findById(id);
    if (!team) throw new AppError("Team not found", 404);
    return team;
  }

  async getTeamsByCompetition(competitionId: string) {
    return this.teamRepo.findByCompetition(competitionId);
  }

  async getTeamsByLeader(leaderId: string) {
    return this.teamRepo.findByLeader(leaderId);
  }

  async updateTeam(id: string, data: TeamUpdateData) {
    const team = await this.teamRepo.findById(id);
    if (!team) {
      throw new AppError("Team not found", 404);
    }

    if (data.name) {
      const teamName = data.name;
      const existingTeams = await this.teamRepo.findByCompetition(team.competitionId);
      const nameExists = existingTeams.some(
        (t) => t.id !== id && t.name.toLowerCase() === teamName.toLowerCase()
      );
      if (nameExists) {
        throw new AppError("Team name already exists for this competition", 409);
      }
    }

    try {
      return await this.teamRepo.updateById(id, data);
    }
    catch {
      throw new AppError("Team not found", 404);
    }
  }

  async deleteTeam(id: string) {
    try {
      await this.teamRepo.deleteById(id);
      return true;
    }
    catch {
      throw new AppError("Team not found", 404);
    }
  }

  async addTeamMember(teamId: string, userId: string) {
    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const existingMember = await this.teamRepo.findMember(teamId, userId);
    if (existingMember) {
      throw new AppError("User is already a member of this team", 409);
    }

    if (team.leaderId === userId) {
      throw new AppError("Team leader is already part of the team", 409);
    }

    return this.teamRepo.addMember(teamId, userId);
  }

  async removeTeamMember(teamId: string, userId: string) {
    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new AppError("Team not found", 404);
    }

    if (team.leaderId === userId) {
      throw new AppError("Cannot remove team leader", 400);
    }

    const result = await this.teamRepo.removeMember(teamId, userId);
    if (result.count === 0) {
      throw new AppError("User is not a member of this team", 404);
    }

    return true;
  }

  async getTeamMembers(teamId: string) {
    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new AppError("Team not found", 404);
    }

    return this.teamRepo.getTeamMembers(teamId);
  }
}
