import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  try {
    const stats = {
      users: await prisma.user.count(),
      messages: await prisma.message.count(),
      unreadAdmin: await (prisma.message as any).count({ 
        where: { isRead: false, receiver: { role: "ADMIN" } } 
      }),
    };
    console.log("STATS:", stats);

    const users = await prisma.user.findMany({ select: { id: true, name: true, role: true } });
    console.log("USERS:", users);

    const messages = await (prisma.message as any).findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: { sender: true, receiver: true }
    });
    console.log("LAST 20 MESSAGES:", messages.map((m: any) => ({
      id: m.id,
      from: m.sender.name,
      fromRole: m.sender.role,
      to: m.receiver.name,
      toRole: m.receiver.role,
      content: m.content.slice(0, 30),
      isRead: m.isRead,
      videoId: m.videoId
    })));

  } catch (err) {
    console.error("DEBUG-ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

check();
