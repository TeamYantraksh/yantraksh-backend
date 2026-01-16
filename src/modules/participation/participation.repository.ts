import prisma from "../../config/client";

type ParticipationCreateData = {
  userId: string;
  competitionId: string;
  teamId?: string;
};

type ParticipationUpdateData = Partial<ParticipationCreateData>;

export default class ParticipationRepository {
  create(data: ParticipationCreateData) {
    return prisma.participation.create({data});
  }

  findAll() {
    return prisma.participation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
          },
        },
        competition: true,
        team: {
          select: {
            id: true,
            name: true,
            competitionId: true,
            leaderId: true,
          },
        },
      },
    });
  }

  findById(id: string) {
    return prisma.participation.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
          },
        },
        competition: true,
        team: {
          select: {
            id: true,
            name: true,
            competitionId: true,
            leaderId: true,
          },
        },
      },
    });
  }

  findByUser(userId: string) {
    return prisma.participation.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
          },
        },
        competition: true,
        team: {
          select: {
            id: true,
            name: true,
            competitionId: true,
            leaderId: true,
          },
        },
      },
    });
  }

  findByCompetition(competitionId: string) {
    return prisma.participation.findMany({
      where: { competitionId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
          },
        },
        competition: true,
        team: {
          select: {
            id: true,
            name: true,
            competitionId: true,
            leaderId: true,
          },
        },
      },
    });
  }

  updateById(id: string, data: ParticipationUpdateData) {
    return prisma.participation.update({where: { id }, data});
  }

  deleteById(id: string) {
    return prisma.participation.delete({where:{ id }});
  }
}

