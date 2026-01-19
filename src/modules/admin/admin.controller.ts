import { Response } from "express";
import { AuthRequest } from "../../types/request";
import { AdminService } from "./admin.service";

const service = new AdminService();

export class AdminController {

    async dashboard(req: AuthRequest, res: Response) {
        try {
            const stats = await service.getDashboardStats();
            res.json(stats);
        } catch (error) {
            res.status(500).json({ message: "Error fetching dashboard stats" });
        }
    }

    async createCompetition(req: AuthRequest, res: Response) {
        try {
            const competition = await service.createCompetition(req.body);
            res.json(competition);
        } catch (error) {
            console.error("Create Competition Error:", error);
            res.status(500).json({ message: "Error creating competition" });
        }
    }

    async updateCompetition(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const competition = await service.updateCompetition(id as string, req.body);
            res.json(competition);
        } catch (error) {
            console.error("Update Competition Error:", error);
            res.status(500).json({ message: "Error updating competition" });
        }
    }

    async deleteCompetition(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            await service.deleteCompetition(id as string);
            res.status(200).json({ message: "Competition deleted successfully" });
        } catch (error) {
            console.error("Delete Competition Error:", error);
            res.status(500).json({ message: "Error deleting competition" });
        }
    }

    async getCompetitions(req: AuthRequest, res: Response) {
        try {
            const comps = await service.getCompetitions();
            res.json(comps);
        } catch (error) {
            res.status(500).json({ message: "Error fetching competitions" });
        }
    }


}
