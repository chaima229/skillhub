import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const groups = [
    { name: "Groupe A" },
    { name: "Groupe B" },
    { name: "Groupe C" },
    { name: "Groupe D" },
    { name: "Groupe E" },
  ];
  for (const group of groups) {
    await prisma.group.create({ data: group });
  }
  console.log("✅ Groupes insérés !");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
