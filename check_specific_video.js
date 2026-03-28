const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const video = await prisma.video.findUnique({
    where: { id: "266a261e-f206-47fd-80cf-1fa688f68174" },
    include: { category: true }
  });
  console.log(JSON.stringify(video, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
