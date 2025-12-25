import { UniversityRepository } from "../repository/UniversityRepository";

const repository = new UniversityRepository();

class UniversityService {
  async findAllUniversity(skip: number, take: number) {
    return await repository.findAllUniversity(skip, take);
  }

  async createUniversity(name: string): Promise<boolean> {
    const hasSaved = await repository.create(name);
    return hasSaved;
  }
}

export { UniversityService };
