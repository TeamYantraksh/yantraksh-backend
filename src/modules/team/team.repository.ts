import prisma from "../../config/client";

type TeamCreateData = {
  name: string;
  competitionId: string;
  leaderId: string;
};

type TeamUpdateData = Partial<Pick<TeamCreateData, "name">>;

export default class TeamRepository {
  create(data: TeamCreateData) {
    return prisma.team.create({
      data,
      include: {
        leader: {
          select: {
            id: true,  name: true, email: true,  userType: true,
          },
        },
        competition: true,
        members: {
          include: {
            user: {
              select: {
                id: true,  name: true,  email: true,  userType: true,
              },
            },
          },
        },
      },
    });
  }

  findAll() {
    return prisma.team.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        leader: {
          select: {
            id: true,  name: true,  email: true,  userType: true,
          },
        },
        competition: true,
        members: {
          include: {
            user: {
              select: {
                id: true,  name: true,  email: true,  userType: true,
              },
            },
          },
        },
      },
    });
  }

  findById(id: string) {
    return prisma.team.findUnique({
      where: { id },
      include: {
        leader: {
          select: {
            id: true, name: true, email: true, userType: true,
          },
        },
        competition: true,
        members: {
          include: {
            user: {
               select: {
                id: true, name: true, email: true, userType: true,
              },
            },
          },
        },
      },
    });
  }

  findByCompetition(competitionId: string) {
    return prisma.team.findMany({
      where: { competitionId },
      orderBy: { createdAt: "desc" },
      include: {
        leader: {
          select: {
            id: true, name: true, email: true, userType: true,
          },
        },
        competition: true,
        members: {
          include: {
            user: {
              select: {
                id: true, name: true, email: true, userType: true,
              },
            },
          },
        },
      },
    });
  }

  findByLeader(leaderId: string) {
    return prisma.team.findMany({
      where: { leaderId },
      orderBy: { createdAt: "desc" },
      include: {
        leader: {
          select: {
            id: true, name: true, email: true, userType: true,
          },
        },
        competition: true,
        members: {
          include: {
            user: {
              select: {
                id: true, name: true, email: true, userType: true,
              },
            },
          },
        },
      },
    });
  }

  updateById(id: string, data: TeamUpdateData) {
    return prisma.team.update({
      where: { id },
      data,
      include: {
        leader: {
          select: {
            id: true, name: true, email: true, userType: true,
          },
        },
        competition: true,
        members: {
          include: {
            user: {
              select: {
                id: true, name: true, email: true, userType: true,
              },
            },
          },
        },
      },
    });
  }

  deleteById(id: string) {
    return prisma.team.delete({
      where: { id },
    });
  }

  addMember(teamId: string, userId: string) {
    return prisma.teamMember.create({
      data: {
        teamId,  userId,
      },
      include: {
        user: {
          select: {
            id: true, name: true, email: true, userType: true,
          },
        },
      },
    });
  }

  removeMember(teamId: string, userId: string) {
    return prisma.teamMember.deleteMany({
      where: {
        teamId,  userId,
      },
    });
  }

  findMember(teamId: string, userId: string) {
    return prisma.teamMember.findFirst({
      where: {
        teamId,  userId,
      },
    });
  }

  getTeamMembers(teamId: string) {
    return prisma.teamMember.findMany({
      where: { teamId },
      include: {
        user: {
          select: {
            id: true,  name: true,  email: true,  userType: true,
          },
        },
      },
    });
  }
}
