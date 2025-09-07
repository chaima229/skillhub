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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
