import { prisma } from "libs/prisma";

class UniversityRepository {
  async findAllUniversity(skip: number, take: number = 10) {
    return await prisma.university.findMany({
      take,
      skip,
      select: {
        id: true,
        name: true,
      },
    });
  }
  async create(name: string): Promise<boolean> {
    const hasUniversity = await prisma.university.findFirst({
      where: {
        name,
      },
    });
    if (hasUniversity) {
      return false;
    }
    const newUniversity = await prisma.university.create({
      data: {
        name: name.toLocaleUpperCase(),
      },
    });
    if (newUniversity) {
      return true;
    }
    return false;
  }
}

export { UniversityRepository };
