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
  constructor(private teamRepo: TeamRepository) { }

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

  async addTeamMember(teamId: string, userId: string, status: "PENDING" | "CONFIRMED" = "CONFIRMED") {
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

    // Check team size (optional here, but good practice. Max 4 members + leader? Or total 4 including leader?)
    // Assuming total 4.
    const members = await this.teamRepo.getTeamMembers(teamId);
    // Be careful: pending members count towards limit? Yes.
    if (members.length >= 3) { // 1 Leader + 3 Members = 4 Total
      // But actually members array includes leader if leader is in TeamMember table? 
      // Logic: One Team has One Leader (in Team table).
      // Members are in TeamMember table.
      // Does Leader also have a record in TeamMember?
      // In createTeam (repo), we create Team leader relation. We don't seem to create TeamMember for leader explicitly in createTeam?
      // Let's check createTeam. 
      // Repo create: prisma.team.create({ data: ..., include: members... }) 
      // It doesn't auto-create TeamMember for leader. 
      // But in Frontend we assume Leader is part of members.
      // If Leader is NOT in TeamMember, then getting members only returns added members.
      // So 4 members max means 4 entries in TeamMember? Or 3 entries + Leader?
      // Let's assume 4 entries in TeamMember allowed (if leader added themselves?).
      // Standard: Leader + 3 Members. 
      if (members.length >= 4) throw new AppError("Team is full", 400);
    }

    return this.teamRepo.addMember(teamId, userId, status);
  }

  async addTeamMemberByEmail(teamId: string, email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("User with this email not found. They must be registered first.", 422);
    }

    return this.addTeamMember(teamId, user.id, "PENDING");
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

    // Also remove participation
    await prisma.participation.deleteMany({
      where: {
        userId,
        competitionId: team.competitionId,
        teamId // Optional check to be safe
      }
    });

    return true;
  }

  async getTeamMembers(teamId: string) {
    const team = await this.teamRepo.findById(teamId);
    if (!team) {
      throw new AppError("Team not found", 404);
    }

    const members = await this.teamRepo.getTeamMembers(teamId);

    // Check if leader is already in members (shouldn't be based on schema, but safety check)
    const leaderInMembers = members.some(m => m.userId === team.leaderId);

    if (!leaderInMembers && team.leader) {
      // Construct a member object for the leader
      const leaderMember = {
        id: "leader", // specific ID or generate one
        teamId: team.id,
        userId: team.leaderId,
        status: "CONFIRMED",
        role: "LEADER", // Add role field to distinguish
        user: {
          id: team.leader.id,
          name: team.leader.name,
          email: team.leader.email,
          userType: team.leader.userType
        }
      };
      return [leaderMember, ...members];
    }

    return members;
  }

  async acceptInvitation(teamId: string, userId: string) {
    const member = await this.teamRepo.findMember(teamId, userId);
    if (!member) throw new AppError("Invitation not found", 404);

    await this.teamRepo.updateMemberStatus(teamId, userId, "CONFIRMED");

    // Auto-create participation
    const team = await this.teamRepo.findById(teamId);
    if (team) {
      // Check if already participating
      const existingParticipation = await prisma.participation.findFirst({
        where: { userId, competitionId: team.competitionId }
      });

      if (!existingParticipation) {
        await prisma.participation.create({
          data: {
            userId,
            teamId,
            competitionId: team.competitionId
          }
        });
      }
    }

    return member;
  }

  async rejectInvitation(teamId: string, userId: string) {
    return this.teamRepo.removeMember(teamId, userId);
  }

  async getPendingInvitations(userId: string) {
    console.log("TeamService.getPendingInvitations called for:", userId);
    try {
      const results = await prisma.teamMember.findMany({
        where: {
          userId,
          status: "PENDING"
        },
        include: {
          team: {
            include: {
              competition: true,
              leader: {
                select: { name: true, email: true }
              }
            }
          }
        }
      });
      console.log("Prisma results:", results);
      return results;
    } catch (error) {
      console.error("Prisma error in getPendingInvitations:", error);
      throw error;
    }
  }
}
