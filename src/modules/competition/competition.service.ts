import { AppError } from "../../core/AppError";
import CompetitionRepository from "./competition.repository";

type CompetitionCreateData = {
  name: string;
  type: "SOLO" | "TEAM";
  prize: number;
  venue: string;
  eventDate: Date;
  maxParticipants: number;
  status: "UPCOMING" | "ONGOING" | "COMPLETED";
  description?: string;
  conductedById: string;
};

type CompetitionUpdateData = Partial<Omit<CompetitionCreateData, "conductedById">>;

export class CompetitionService {
  constructor(private CompetitionRepository: CompetitionRepository) { }

  async createCompetition(data: CompetitionCreateData) {
    return this.CompetitionRepository.create(data);
  }

  async getAllCompetitions() {
    return this.CompetitionRepository.findAll();
  }

  async getCompetitionById(id: string) {
    const competition = await this.CompetitionRepository.findById(id);
    if (!competition) throw new AppError("Competition not found", 404);
    return competition;
  }

  async updateCompetition(id: string, data: CompetitionUpdateData) {
    try {
      return await this.CompetitionRepository.updateById(id, data);
    } catch {
      throw new AppError("Competition not found", 404);
    }
  }

  async deleteCompetition(id: string) {
    try {
      await this.CompetitionRepository.deleteById(id);
      return true;
    }
    catch {
      throw new AppError("Competition not found", 404);
    }
  }
}

