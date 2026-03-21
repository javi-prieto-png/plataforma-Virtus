import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // En producción (Vercel), usamos el cliente estándar para conectar a una DB externa
  prismaInstance = new PrismaClient({
    log: ["error"],
  });
} else {
  // En desarrollo local seguimos usando SQLite con Adaptador
  const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
  const Database = require("better-sqlite3");
  
  const adapter = new PrismaBetterSqlite3(new Database("./dev.db"));
  
  prismaInstance = globalForPrisma.prisma || new PrismaClient({ 
    adapter,
    log: ["query", "error", "warn"] 
  });
}

export const prisma = prismaInstance;
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
export default prisma;
