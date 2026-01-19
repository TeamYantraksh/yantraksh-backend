
import CompetitionRepository from "./competition.repository";
import { CompetitionService } from "./competition.service";
import { Request, Response } from "express";
import { AuthRequest } from "../../types/request";

export class CompetitionController {
  private competitionService: CompetitionService;

  constructor() {
    const repo = new CompetitionRepository();
    this.competitionService = new CompetitionService(repo);
  }

  createCompetition = async (req: AuthRequest, res: Response) => {
    if (!req.user) throw new Error("User not found");

    const createData = {
      name: req.body.name,
      type: req.body.type,
      prize: Number(req.body.prize),
      venue: req.body.venue,
      eventDate: new Date(req.body.eventDate),
      maxParticipants: Number(req.body.maxParticipants),
      status: req.body.status || "UPCOMING",
      description: req.body.description,
      conductedById: req.user.id,
    };

    // Use 'as any' to match service signature if strictly typed otherwise
    const competition = await this.competitionService.createCompetition(createData as any);
    res.status(200).json({
      success: true, data: competition
    });
  };

  getAllCompetitions = async (_req: Request, res: Response) => {
    const competitions = await this.competitionService.getAllCompetitions();
    res.status(200).json({
      success: true, data: competitions
    });
  };

  getCompetitionById = async (req: Request, res: Response) => {
    const competition = await this.competitionService.getCompetitionById(req.params.id as string);
    res.status(200).json({
      success: true, data: competition
    });
  };

  updateCompetition = async (req: Request, res: Response) => {
    const competition = await this.competitionService.updateCompetition(
      req.params.id as string,
      req.body
    );
    res.status(200).json({
      success: true, data: competition
    });
  };

  deleteCompetition = async (req: Request, res: Response) => {
    await this.competitionService.deleteCompetition(req.params.id as string);
    res.status(200).json({
      success: true, message: "Competition Deleted Successfully"
    });
  };
}

