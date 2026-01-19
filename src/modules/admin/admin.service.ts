import { AdminRepository } from "./admin.repository";

export class AdminService {
    private repo = new AdminRepository();

    async getDashboardStats() {
        const [events, participations, merch, admins] = await this.repo.dashboardStats();

        return {
            totalEvents: events,
            totalParticipants: participations,
            totalMerchSold: merch._sum.stock || 0, // Placeholder as schema doesn't track "Sold" yet effectively other than soldCount
            activeCoordinators: admins
        };
    }

    async createCompetition(data: any) {
        return await this.repo.createCompetition(data);
    }

    async updateCompetition(id: string, data: any) {
        // Remove undefined fields to avoid overwriting with null/undefined
        const cleanData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null));
        return await this.repo.updateCompetition(id, cleanData);
    }

    async deleteCompetition(id: string) {
        return await this.repo.deleteCompetition(id);
    }

    async getCompetitions() {
        const competitions = await this.repo.getCompetitions();
        return competitions.map(c => ({
            id: c.id,
            name: c.name,
            description: c.description || "",
            conductedBy: c.conductedBy?.name || "Admin",
            coordinatorId: c.conductedById,
            date: c.eventDate ? new Date(c.eventDate).toISOString().split('T')[0] : "",
            venue: c.venue,
            maxParticipants: c.maxParticipants,
            participantsCount: c.participations ? c.participations.length : 0,
            status: c.status.toUpperCase()
        }))
    }
}
