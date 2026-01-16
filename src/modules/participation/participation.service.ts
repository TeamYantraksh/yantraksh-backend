import { AppError } from "../../core/AppError";
import ParticipationRepository from "./participation.repository";

type ParticipationCreateData = {
  userId: string;
  competitionId: string;
  teamId?: string;
};

type ParticipationUpdateData = Partial<ParticipationCreateData>;

export class ParticipationService {
  constructor(private participationRepo: ParticipationRepository) {}

  async createParticipation(data: ParticipationCreateData) {
    const existing = await this.participationRepo.findByCompetition(data.competitionId);
    const alreadyIn = existing.some((p) => p.userId === data.userId);
    if (alreadyIn) {
      throw new AppError("User already participating in this competition", 409);
    }

    return this.participationRepo.create(data);
  }

  async getAllParticipations() {
    return this.participationRepo.findAll();
  }

  async getParticipationById(id: string) {
    const participation = await this.participationRepo.findById(id);
    if (!participation) throw new AppError("Participation not found", 404);
    return participation;
  }

  async getParticipationsByUser(userId: string) {
    return this.participationRepo.findByUser(userId);
  }

  async getParticipationsByCompetition(competitionId: string) {
    return this.participationRepo.findByCompetition(competitionId);
  }

  async updateParticipation(id: string, data: ParticipationUpdateData) {
    try {
      return await this.participationRepo.updateById(id, data);
    } catch {
      throw new AppError("Participation not found", 404);
    }
  }

  async deleteParticipation(id: string) {
    try {
      await this.participationRepo.deleteById(id);
      return true;
    } catch {
      throw new AppError("Participation not found", 404);
    }
  }
}

