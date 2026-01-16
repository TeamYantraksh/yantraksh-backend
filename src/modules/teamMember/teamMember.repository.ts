import prisma from "../../config/client";

type TeamMemberCreateData = {
  teamId: string;
  userId: string;
};

export default class TeamMemberRepository {
  create(data: TeamMemberCreateData) {
    return prisma.teamMember.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            userType: true,
          },
        },
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

  findAll() {
    return prisma.teamMember.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true, name: true, email: true, userType: true,
          },
        },
        team: {
          select: {
            id: true, name: true, competitionId: true, leaderId: true,
          },
        },
      },
    });
  }

  findById(id: string) {
    return prisma.teamMember.findUnique({
      where: {id},
      include: {
        user: {
          select: {
            id: true, name: true, email: true, userType: true,
          },
        },
        team: {
          select: {
            id: true, name: true, competitionId: true, leaderId: true,
          },
        },
      },
    });
  }

  findByTeam(teamId: string) {
    return prisma.teamMember.findMany({
      where: { teamId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true, name: true, email: true, userType: true,
          },
        },
        team: {
          select: {
            id: true, name: true, competitionId: true, leaderId: true,
          },
        },
      },
    });
  }

  findByUser(userId: string) {
    return prisma.teamMember.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true, name: true, email: true, userType: true,
          },
        },
        team: {
          select: {
            id: true, name: true, competitionId: true, leaderId: true,
          },
        },
      },
    });
  }

  findByTeamAndUser(teamId: string, userId: string) {
    return prisma.teamMember.findFirst({
      where: {
        teamId, userId,
      },
      include: {
        user: {
          select: {
            id: true, name: true, email: true, userType: true,
          },
        },
        team: {
          select: {
            id: true, name: true, competitionId: true, leaderId: true,
          },
        },
      },
    });
  }

  deleteById(id: string) {
    return prisma.teamMember.delete({
      where: {id},
    });
  }

  deleteByTeamAndUser(teamId: string, userId: string) {
    return prisma.teamMember.deleteMany({
      where: {
        teamId, userId,
      },
    });
  }
}
