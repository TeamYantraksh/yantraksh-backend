import prisma from "../../config/client";

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

export default class CompetitionRepository {
  create(data: CompetitionCreateData) {
    return prisma.competition.create({ data });
  }

  findAll() {
    return prisma.competition.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        conductedBy: true,
        _count: { select: { participations: true } }
      }
    });
  }

  findById(id: string) {
    return prisma.competition.findUnique({
      where: { id }
    });
  }

  updateById(id: string, data: CompetitionUpdateData) {
    return prisma.competition.update({
      where: { id }, data
    });
  }

  deleteById(id: string) {
    return prisma.competition.delete({
      where: { id }
    });
  }
}

