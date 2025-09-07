import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const competences = await prisma.competence.findMany({ take: 3 });
  const projects = await prisma.project.findMany({ take: 2 });

  if (competences.length < 3 || projects.length < 2) {
    throw new Error("Pas assez de compétences ou de projets en base !");
  }

  const competenceOnProjects = [
    { competenceId: competences[0].id, projectId: projects[0].id },
    { competenceId: competences[1].id, projectId: projects[0].id },
    { competenceId: competences[2].id, projectId: projects[1].id },
  ];

  for (const cop of competenceOnProjects) {
    await prisma.competenceOnProject.create({ data: cop });
  }
  console.log("✅ Compétences liées à des projets !");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
