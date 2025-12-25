import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🔍 Buscando duplicatas de CutOff...");

  // 1. Agrupa por courseId e year para achar quem tem mais de 1 registro
  const duplicates = await prisma.cutOff.groupBy({
    by: ["courseId", "year"],
    _count: {
      id: true,
    },
    having: {
      id: {
        _count: {
          gt: 1, // Pega apenas grupos que tem mais de 1 registro
        },
      },
    },
  });

  console.log(`Encontrados ${duplicates.length} grupos de CutOff duplicados.`);

  // 2. Itera sobre cada grupo duplicado para limpar
  for (const group of duplicates) {
    // Busca os IDs reais desses registros duplicados
    const records = await prisma.cutOff.findMany({
      where: {
        courseId: group.courseId,
        year: group.year,
      },
      orderBy: {
        // Opcional: Mantém o mais antigo ou o mais recente.
        // Aqui estou ordenando para manter o primeiro que foi criado (se tivesse createdAt)
        // Como não tem createdAt no CutOff, a ordem será por ID, o que é arbitrário mas funcional.
        id: "asc",
      },
    });

    // O primeiro registro (índice 0) é o que vamos MANTER.
    // Do índice 1 para frente, vamos DELETAR.
    const recordsToDelete = records.slice(1);
    const idsToDelete = recordsToDelete.map((r) => r.id);

    if (idsToDelete.length > 0) {
      // A. Primeiro deletamos as categorias associadas (filhos)
      await prisma.cutOffCategory.deleteMany({
        where: {
          cutOffId: { in: idsToDelete },
        },
      });

      // B. Depois deletamos os CutOffs duplicados (pais)
      await prisma.cutOff.deleteMany({
        where: {
          id: { in: idsToDelete },
        },
      });

      console.log(
        `🗑️ Removidos ${idsToDelete.length} duplicados para o curso ${group.courseId} no ano ${group.year}`
      );
    }
  }

  console.log("✅ Limpeza concluída!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export { prisma };
