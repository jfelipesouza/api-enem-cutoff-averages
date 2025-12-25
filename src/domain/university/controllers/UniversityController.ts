import type { Request, Response } from "express";
import { Router } from "express";
import { UniversityService } from "../service/UniversityService";
import { stat } from "node:fs";

const universityController = Router();

const service = new UniversityService();

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
  const { name } = req.body;

  if (name === "" || name === null) {
    res.status(400).send({
      error: "Bad Request",
      message: "Name is required",
    });
  }
  console.log({ name });
  res.status(201).send();
});

export { universityController };
