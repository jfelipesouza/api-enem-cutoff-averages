import { prisma } from "libs/prisma";

class UniversityRepository {
  async findAllUniversity(skip: number, take: number = 10) {
    return await prisma.university.findMany({
      take,
      skip,
      select: {
        id: true,
        name: true,
        _count: { select: { courses: true } },
      },
    });
  }

  async create(name: string): Promise<boolean> {
    const hasUniversity = await prisma.university.findFirst({
      where: {
        name: name.toUpperCase(),
      },
    });

    if (!hasUniversity) {
      await prisma.university.create({
        data: {
          name: name.toUpperCase(),
        },
      });
      return true;
    }

    return false;
  }
}

export { UniversityRepository };
