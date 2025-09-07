import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const submissions = [
    { title: "Livrable 1", content: "Contenu 1" },
    { title: "Livrable 2", content: "Contenu 2" },
    { title: "Livrable 3", content: "Contenu 3" },
    { title: "Livrable 4", content: "Contenu 4" },
    { title: "Livrable 5", content: "Contenu 5" },
  ];
  for (const sub of submissions) {
    await prisma.submission.create({ data: sub });
  }
  console.log("✅ Submissions insérées !");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
