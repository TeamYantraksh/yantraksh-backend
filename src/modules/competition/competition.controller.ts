
import CompetitionRepository from "./competition.repository";
import { CompetitionService } from "./competition.service";
import { Request,Response } from "express";

export class CompetitionController {
  private competitionService: CompetitionService;

  constructor() {
    const repo = new CompetitionRepository();
    this.competitionService = new CompetitionService(repo);
  }

  createCompetition = async (req: Request, res: Response) => {
    const competition = await this.competitionService.createCompetition(req.body);
    res.status(200).json({
      success:true, data:competition});
  };

  getAllCompetitions = async (_req: Request, res: Response) => {
    const competitions = await this.competitionService.getAllCompetitions();
    res.status(200).json({
      success:true, data:competitions});
  };

  getCompetitionById = async (req: Request, res: Response) => {
    const competition = await this.competitionService.getCompetitionById(req.params.id);
    res.status(200).json({
      success:true, data:competition});
  };

  updateCompetition = async (req: Request, res: Response) => {
    const competition = await this.competitionService.updateCompetition(
      req.params.id,
      req.body
    );
    res.status(200).json({
      success:true, data:competition});
  };

  deleteCompetition = async (req: Request, res: Response) => {
    await this.competitionService.deleteCompetition(req.params.id);
    res.status(200).json({
      success:true, message:"Competition Deleted Successfully"});
  };
}

