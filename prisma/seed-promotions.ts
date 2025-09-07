import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const promotions = [
    { name: "Promotion 2021" },
    { name: "Promotion 2022" },
    { name: "Promotion 2023" },
    { name: "Promotion 2024" },
    { name: "Promotion 2025" },
    { name: "Promotion Alpha" },
    { name: "Promotion Beta" },
    { name: "Promotion Gamma" },
    { name: "Promotion Delta" },
    { name: "Promotion Omega" },
  ];

  for (const promo of promotions) {
    await prisma.promotion.create({
      data: promo,
    });
  }

  console.log("✅ 10 promotions insérées avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
