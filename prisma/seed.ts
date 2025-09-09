import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: "Alice Apprenant",
      email: "alicee@example.com",
      role: Role.APPRENANT,
      password: "password1",
    },
    {
      name: "Bob Formateur",
      email: "melloukchaimaa7@gmail.com",
      role: Role.FORMATEUR,
      password: "password2",
    },
    {
      name: "Chaimaa Responsable",
      email: "melloukchaimaa99@gmail.com",
      role: Role.RESPONSABLE,
      password: "password3",
    },
    {
      name: "David Apprenant",
      email: "david@example.com",
      role: Role.APPRENANT,
      password: "password4",
    },
    {
      name: "Emma Formatrice",
      email: "emma.formatrice@example.com",
      role: Role.FORMATEUR,
      password: "password5",
    },
    {
      name: "Farid Responsable",
      email: "farid.responsable@example.com",
      role: Role.RESPONSABLE,
      password: "password6",
    },
    {
      name: "Gina Apprenant",
      email: "gina@example.com",
      role: Role.APPRENANT,
      password: "password7",
    },
    {
      name: "Hassan Formateur",
      email: "hassan.formateur@example.com",
      role: Role.FORMATEUR,
      password: "password8",
    },
    {
      name: "Ines Responsable",
      email: "ines.responsable@example.com",
      role: Role.RESPONSABLE,
      password: "password9",
    },
    {
      name: "Jamal Apprenant",
      email: "jamal@example.com",
      role: Role.APPRENANT,
      password: "password10",
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 12);
    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
      },
    });
  }

  console.log("✅ 10 utilisateurs insérés avec succès !");

  // Seed projects
  const formateurUser = await prisma.user.findFirst({ where: { role: Role.FORMATEUR } });
  if (!formateurUser) {
    console.error("Formateur user not found, cannot seed projects.");
    return;
  }

  const projects = [
    {
      title: "Développement d'une application de gestion de compétences",
      description: "Création d'une application web full-stack pour gérer les compétences des apprenants.",
      objectives: "Maitriser les technologies front-end (React, TypeScript) et back-end (Node.js, Express, Prisma, PostgreSQL).",
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 3)), // 3 months from now
      createdById: formateurUser.id,
    },
    {
      title: "Implémentation d'un système de recommandation",
      description: "Concevoir et développer un système de recommandation basé sur les compétences et les projets.",
      objectives: "Explorer les algorithmes de recommandation et leur intégration dans une application existante.",
      deadline: new Date(new Date().setMonth(new Date().getMonth() + 6)), // 6 months from now
      createdById: formateurUser.id,
    },
  ];

  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  console.log("✅ Projets insérés avec succès !");

  // Seed notifications
  const apprenantUser = await prisma.user.findFirst({ where: { role: Role.APPRENANT } });
  if (!apprenantUser) {
    console.error("Apprenant user not found, cannot seed notifications.");
    return;
  }

  const notifications = [
    {
      message: "Votre soumission pour le projet 'Application de gestion' a été évaluée.",
      userId: apprenantUser.id,
      read: false,
    },
    {
      message: "Nouveau projet disponible : 'Système de recommandation'.",
      userId: apprenantUser.id,
      read: false,
    },
  ];

  for (const notification of notifications) {
    await prisma.notification.create({ data: notification });
  }

  console.log("✅ Notifications insérées avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
