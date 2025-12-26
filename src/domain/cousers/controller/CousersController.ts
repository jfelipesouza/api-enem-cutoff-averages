import { Request, Response, Router } from "express";
import { prisma } from "libs/prisma";

const cousersController = Router();

// Buscar Curso
cousersController.get("/findAll", async (req: Request, res: Response) => {
  if (Object.keys(req.query).length === 0) {
    res.status(400).send({ message: "Invalid request", error: "Bad Request" });
    return;
  }
  const name = req.query.name as string | undefined;
  const skip = req.query.skip as number | undefined;
  const take = req.query.take as number | undefined;

  if (!name || name.trim() === "") {
    res.status(404).send({
      message: "Course not found",
      error: "Not Found",
    });
    return;
  }

  const allCoursesByName = await prisma.course.findMany({
    where: {
      name: {
        contains: name.trim().toUpperCase(),
      },
    },
    select: {
      id: true,
      name: true,
      university: {
        select: {
          name: true,
          id: true,
        },
      },
      cutOffs: {
        select: {
          year: true,
          categories: {
            select: {
              name: true,
              score: true,
            },
          },
        },
      },
    },
    skip: skip ? Number(skip) : 0,
    take: take ? Number(take) : 10,
  });

  res.status(200).send({
    courses: allCoursesByName,
  });
});

// Criar Curso
cousersController.post("/create", async (req: Request, res: Response) => {
  const { name, redacao, math, language, human, nature, universityId } =
    req.body;

  const isInvalidString = (v: any) => typeof v !== "string" || v.trim() === "";

  const isInvalidScore = (v: any) => typeof v !== "number" || v < 0;

  if (
    isInvalidString(name) ||
    isInvalidString(universityId) ||
    isInvalidScore(redacao) ||
    isInvalidScore(math) ||
    isInvalidScore(language) ||
    isInvalidScore(human) ||
    isInvalidScore(nature)
  ) {
    res.status(400).json({
      error: "Bad Request",
      message: "The fields contain invalid values.",
    });
    return;
  }

  const courseAlredyExist = await prisma.course.findFirst({
    where: {
      universityId: universityId,
      name: name.trim().toUpperCase(),
    },
  });
  if (courseAlredyExist) {
    res.status(400).json({
      error: "Bad Resquest",
      message: "The course already exist in university",
    });
    return;
  }
  const createCourse = await prisma.course.create({
    data: {
      name: name.trim().toUpperCase(),
      human_weight: human,
      math_weight: math,
      redacao_weight: redacao,
      nature_weight: nature,
      language_weight: language,
      university: {
        connect: {
          id: universityId,
        },
      },
    },
  });
  if (createCourse) {
    res.status(201).send();
    return;
  }
  res.status(500).send({
    error: "Internal Server Error",
    message: "Error creating course in database",
  });
});

// Criar varios Cursos
cousersController.post("/createMany", async (req: Request, res: Response) => {
  const { data } = req.body;
  if (data === "null") {
    res.status(500).send({
      message: "FAILURE",
    });
  }
  const mapCourse = ({
    name,
    redacao,
    math,
    language,
    human,
    nature,
    universityId,
  }: any) => ({
    name: name.trim().toUpperCase(),
    human_weight: human,
    math_weight: math,
    redacao_weight: redacao,
    nature_weight: nature,
    language_weight: language,
    universityId,
  });

  const parseData = data.map((obj: any) => {
    return mapCourse({ ...obj });
  });

  const exists = await prisma.university.findUnique({
    where: { id: parseData[0].universityId },
  });

  if (!exists) {
    return res.status(404).json({ message: "University not found" });
  }

  try {
    const createdCourses = await prisma.$transaction(
      parseData.map((course: any) => {
        const { universityId, ...courseData } = course;

        return prisma.course.create({
          data: {
            ...courseData,
            university: {
              connect: { id: universityId },
            },
          },
        });
      })
    );

    return res.status(201).json({
      message: "Courses created successfully",
      total: createdCourses.length,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Failed to create courses",
      error: error?.meta?.cause || error.message,
    });
  }
});

// Adicionar nota de corte
cousersController.post("/addCutOff", async (req: Request, res: Response) => {
  const { couserId, year, categories } = req.body as {
    couserId: string;
    year: number;
    categories: { name: string; score: number }[];
  };

  if (
    couserId === "" ||
    couserId === null ||
    year === null ||
    categories === null
  ) {
    res.status(400).send({
      error: "Bad request",
      message: "Invalid request",
    });
    return;
  }
  try {
    const newCutOff = await prisma.cutOff.create({
      data: {
        year,
        course: {
          connect: { id: couserId },
        },
        categories: {
          createMany: {
            data: categories.map((category) => ({
              name: category.name,
              score: category.score,
            })),
          },
        },
      },
    });

    return res.status(201).json({
      message: "CutOff created successfully",
      cutOffId: newCutOff.id,
    });
  } catch (error: any) {
    return res.status(400).json({
      message: "Failed to create CutOff",
      error: error?.meta?.cause || error.message,
    });
  }
});

// Buscar cursos por universidade
cousersController.post(
  "/findByUniversity",
  async (req: Request, res: Response) => {
    const { universityName } = req.body;

    if (universityName === null || universityName === "") {
      res.status(400).send({
        error: "Bad Request",
        message: "Field name is required",
      });
    }

    const allCouser = await prisma.course.findMany({
      where: {
        university: {
          name: {
            equals: universityName.toUpperCase(),
          },
        },
      },
      select: {
        name: true,
        id: true,
        cutOffs: {
          where: {
            year: 2024,
          },
          select: {
            categories: {
              select: {
                name: true,
                score: true,
              },
            },
          },
        },
      },
    });

    res.status(200).send({
      course: allCouser,
    });
  }
);

// Adicionar notas de corte a varios cursos
cousersController.post(
  "/addManyCutOff",
  async (req: Request, res: Response) => {
    const { data } = req.body as {
      data: {
        couserId: string;
        year: number;
        categories: { name: string; score: number }[];
      }[];
    };

    if (!Array.isArray(data) || data.length === 0) {
      return res.status(400).json({
        message: "Invalid request",
      });
    }

    try {
      const result = await prisma.$transaction(
        data.map((item) =>
          prisma.cutOff.create({
            data: {
              year: item.year,
              course: {
                connect: { id: item.couserId },
              },
              categories: {
                createMany: {
                  data: item.categories.map((c) => ({
                    name: c.name,
                    score: c.score,
                  })),
                },
              },
            },
          })
        )
      );

      return res.status(201).json({
        message: "CutOffs created successfully",
        total: result.length,
      });
    } catch (error: any) {
      return res.status(400).json({
        message: "Failed to create CutOffs",
        error: error?.meta?.cause || error.message,
      });
    }
  }
);

export { cousersController };
