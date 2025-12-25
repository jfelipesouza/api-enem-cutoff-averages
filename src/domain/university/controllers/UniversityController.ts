import type { Request, Response } from "express";
import { Router } from "express";
import { UniversityRepository } from "../repository/UniversityRepository";

const universityController = Router();

// Teste de rota principal
universityController.get("/", (req: Request, res: Response) => {
  res.send({
    message: "OK",
  });
});

// Todas as Universidades cadastradas
universityController.get(
  "/getAllUniversity",
  async (req: Request, res: Response) => {
    const service = new UniversityRepository();

    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const take = req.query.take ? Number(req.query.take) : 10;

    res.status(200).send({
      error: null,
      message: await service.findAllUniversity(skip, take),
    });
  }
);

// Salvar uma universidade
universityController.post("/create", async (req: Request, res: Response) => {
  const universityRepository = new UniversityRepository();

  const { name } = req.body;

  if (name.trim() === "" || name === null) {
    res.status(400).send({
      error: "Bad Request",
      message: "Name is required",
    });
  }

  const hasCreated = await universityRepository.create(name.trim());
  if (hasCreated) {
    res.status(201).send();
    return;
  }
  res.status(400).send({
    error: "Bad Request",
    message: "University alread existing",
  });
});

export { universityController };
