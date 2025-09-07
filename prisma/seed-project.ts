import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ take: 1 });
  if (users.length === 0) throw new Error("Aucun user trouvé !");
  const createdBy = { connect: { id: users[0].id } };

  const projects = [
    {
      title: "Projet SkillHub",
      description: "Plateforme de gestion de compétences",
      objectives: "Centraliser les compétences",
      createdBy,
    },
    {
      title: "Projet API",
      description: "API RESTful pour SkillHub",
      objectives: "Fournir des endpoints sécurisés",
      createdBy,
    },
    {
      title: "Projet Frontend",
      description: "Interface utilisateur web",
      objectives: "Expérience utilisateur optimale",
      createdBy,
    },
    {
      title: "Projet Backend",
      description: "Serveur Node.js et gestion des données",
      objectives: "Performance et sécurité",
      createdBy,
    },
    {
      title: "Projet Mobile",
      description: "Application mobile SkillHub",
      objectives: "Accessibilité mobile",
      createdBy,
    },
  ];
  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }
  console.log("✅ Projets insérés !");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
