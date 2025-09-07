import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const projects = await prisma.project.findMany({ take: 1 });
  if (projects.length === 0) throw new Error("Aucun projet trouvé !");
  const projectId = projects[0].id;

  const criteria = [
    { name: "Qualité du code", weight: 5, projectId },
    { name: "Respect des consignes", weight: 4, projectId },
    { name: "Documentation", weight: 3, projectId },
    { name: "Performance", weight: 2, projectId },
    { name: "Sécurité", weight: 1, projectId },
  ];
  for (const crit of criteria) {
    await prisma.evaluationCriteria.create({ data: crit });
  }
  console.log("✅ Critères d'évaluation insérés !");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
