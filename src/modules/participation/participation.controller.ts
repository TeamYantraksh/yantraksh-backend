import { Request, Response } from "express";
import ParticipationRepository from "./participation.repository";
import { ParticipationService } from "./participation.service";

export class ParticipationController {
  private participationService: ParticipationService;

  constructor() {
    const repo = new ParticipationRepository();
    this.participationService = new ParticipationService(repo);
  }

  createParticipation = async (req: Request, res: Response) => {
    const participation = await this.participationService.createParticipation(req.body);
    res.status(201).json({ success: true, data: participation });
  };

  getAllParticipations = async (_req: Request, res: Response) => {
    const participations = await this.participationService.getAllParticipations();
    res.status(200).json({ success: true, data: participations });
  };

  getParticipationById = async (req: Request, res: Response) => {
    const participation = await this.participationService.getParticipationById(req.params.id);
    res.status(200).json({ success: true, data: participation });
  };

  getParticipationsByUser = async (req: Request, res: Response) => {
    const participations = await this.participationService.getParticipationsByUser(
      req.params.userId
    );
    res.status(200).json({ success: true, data: participations });
  };

  getParticipationsByCompetition = async (req: Request, res: Response) => {
    const participations = await this.participationService.getParticipationsByCompetition(
      req.params.competitionId
    );
    res.status(200).json({ success: true, data: participations });
  };

  updateParticipation = async (req: Request, res: Response) => {
    const participation = await this.participationService.updateParticipation(
      req.params.id,
      req.body
    );
    res.status(200).json({ success: true, data: participation });
  };

  deleteParticipation = async (req: Request, res: Response) => {
    await this.participationService.deleteParticipation(req.params.id);
    res.status(200).json({ success: true, message: "Participation deleted successfully" });
  };
}

