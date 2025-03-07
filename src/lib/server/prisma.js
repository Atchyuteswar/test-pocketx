import { PrismaClient } from '@prisma/client';

// Create a singleton instance of Prisma Client
const prisma = global.__prisma || new PrismaClient();

// In development, keep the connection between reloads
if (process.env.NODE_ENV === 'development') {
  global.__prisma = prisma;
}

export { prisma };