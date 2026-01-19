import prisma from "../../config/client";

export class AdminRepository {
  getCompetitions() {
    return prisma.competition.findMany({
      include: {
        teams: true,
        participations: true,
        conductedBy: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  createCompetition(data: any) {
    return prisma.competition.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type || "SOLO",
        prize: data.prize || 0,
        venue: data.venue,
        eventDate: new Date(data.date),
        maxParticipants: data.maxParticipants,
        status: data.status,
        conductedById: data.coordinatorId // User ID of the admin/organizer
      }
    });
  }

  updateCompetition(id: string, data: any) {
    return prisma.competition.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        prize: data.prize,
        venue: data.venue,
        eventDate: data.date ? new Date(data.date) : undefined,
        maxParticipants: data.maxParticipants,
        status: data.status,
        conductedById: data.coordinatorId
      }
    });
  }

  deleteCompetition(id: string) {
    return prisma.competition.delete({
      where: { id }
    });
  }

  dashboardStats() {
    return Promise.all([
      prisma.competition.count(),
      prisma.participation.count(),
      prisma.merch.aggregate({ _sum: { stock: true } }),
      prisma.user.count({ where: { role: "ADMIN" } })
    ]);
  }
}