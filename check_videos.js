const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const videos = await prisma.video.findMany({
    include: {
      category: true
    }
  });
  console.log(JSON.stringify(videos, null, 2));
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
