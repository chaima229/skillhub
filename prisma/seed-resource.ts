import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const projects = await prisma.project.findMany({ take: 1 });
  if (projects.length === 0) throw new Error("Aucun projet trouvé !");
  const project = { connect: { id: projects[0].id } };

  const resources = [
    { type: "Documentation", url: "https://api.example.com", project },
    { type: "Guide", url: "https://frontend.example.com", project },
    { type: "Guide", url: "https://backend.example.com", project },
    { type: "Guide", url: "https://mobile.example.com", project },
    { type: "Documentation", url: "https://www.prisma.io/docs", project },
  ];
  for (const res of resources) {
    await prisma.resource.create({ data: res });
  }
  console.log("✅ Ressources insérées !");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
