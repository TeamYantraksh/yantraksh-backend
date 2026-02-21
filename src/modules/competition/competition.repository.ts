import prisma from "../../config/client";

type CompetitionCreateData = {
  title: string;
  category: string;
  prize: string;
  type: "SOLO" | "TEAM";
  image: string;
  specs: string[];
  needReg?: boolean;
};

type CompetitionUpdateData = Partial<CompetitionCreateData>;

export default class CompetitionRepository {
  create(data: CompetitionCreateData) {
    return prisma.competition.create({ data });
  }

  findAll() {
    return prisma.competition.findMany({
      orderBy: { createdAt: "desc" },
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

