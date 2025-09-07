import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const competences = [
    { name: "JavaScript", level: "Avancé" },
    { name: "TypeScript", level: "Intermédiaire" },
    { name: "Node.js", level: "Avancé" },
    { name: "React", level: "Intermédiaire" },
    { name: "Prisma", level: "Débutant" },
    { name: "PostgreSQL", level: "Intermédiaire" },
    { name: "Express", level: "Avancé" },
    { name: "Swagger", level: "Débutant" },
    { name: "Zod", level: "Débutant" },
    { name: "JWT", level: "Intermédiaire" },
  ];
  for (const comp of competences) {
    await prisma.competence.create({ data: comp });
  }
  console.log("✅ 10 compétences insérées !");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
