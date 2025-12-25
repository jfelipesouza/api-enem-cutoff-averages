import { Router } from "express";
import type { Request, Response } from "express";

import { universityController } from "domain/university/controllers/UniversityController";
import { cousersController } from "domain/cousers/controller/CousersController";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send({
    message: "Server is online",
    code: 200,
    status: "SUCCESS",
  });
});

router.use("/university", universityController);
router.use("/couser", cousersController);

export { router };
