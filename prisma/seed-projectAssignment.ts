import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  // Exemple: assigner le premier user au premier projet
  const assignments = [
    { userId: "idUser1", projectId: "idProject1" },
    { userId: "idUser2", projectId: "idProject2" },
  ];
  for (const assign of assignments) {
    await prisma.projectAssignment.create({ data: assign });
  }
  console.log("✅ Assignations de projets insérées !");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
