import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({ take: 5 });
  if (users.length === 0) throw new Error("Aucun user trouvé !");
  const notifications = [
    {
      message: "Bienvenue sur SkillHub !",
      user: { connect: { id: users[0].id } },
    },
    {
      message: "Votre projet a été validé.",
      user: { connect: { id: users[1].id } },
    },
    {
      message: "Nouvelle compétence ajoutée.",
      user: { connect: { id: users[2].id } },
    },
    { message: "Groupe mis à jour.", user: { connect: { id: users[3].id } } },
    {
      message: "Critère d'évaluation modifié.",
      user: { connect: { id: users[4].id } },
    },
  ];
  for (const notif of notifications) {
    await prisma.notification.create({ data: notif });
  }
  console.log("✅ Notifications insérées !");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
