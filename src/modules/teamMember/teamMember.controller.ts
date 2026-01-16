import { Request, Response } from "express";
import TeamMemberRepository from "./teamMember.repository";
import { TeamMemberService } from "./teamMember.service";

export class TeamMemberController {
  private teamMemberService: TeamMemberService;

  constructor() {
    const repo = new TeamMemberRepository();
    this.teamMemberService = new TeamMemberService(repo);
  }

  createTeamMember = async (req: Request, res: Response) => {
    const teamMember = await this.teamMemberService.createTeamMember(req.body);
    res.status(201).json({
      success: true,
      data: teamMember,
    });
  };

  getAllTeamMembers = async (_req: Request, res: Response) => {
    const teamMembers = await this.teamMemberService.getAllTeamMembers();
    res.status(200).json({
      success: true,
      data: teamMembers,
    });
  };

  getTeamMemberById = async (req: Request, res: Response) => {
    const teamMember = await this.teamMemberService.getTeamMemberById(req.params.id);
    res.status(200).json({
      success: true,
      data: teamMember,
    });
  };

  getTeamMembersByTeam = async (req: Request, res: Response) => {
    const teamMembers = await this.teamMemberService.getTeamMembersByTeam(
      req.params.teamId
    );
    res.status(200).json({
      success: true,
      data: teamMembers,
    });
  };

  getTeamMembersByUser = async (req: Request, res: Response) => {
    const teamMembers = await this.teamMemberService.getTeamMembersByUser(
      req.params.userId
    );
    res.status(200).json({
      success: true,
      data: teamMembers,
    });
  };

  deleteTeamMember = async (req: Request, res: Response) => {
    await this.teamMemberService.deleteTeamMember(req.params.id);
    res.status(200).json({
      success: true,
      message: "Team member deleted successfully",
    });
  };

  deleteTeamMemberByTeamAndUser = async (req: Request, res: Response) => {
    await this.teamMemberService.deleteTeamMemberByTeamAndUser(
      req.params.teamId,
      req.params.userId
    );
    res.status(200).json({
      success: true,
      message: "Team member removed successfully",
    });
  };
}
