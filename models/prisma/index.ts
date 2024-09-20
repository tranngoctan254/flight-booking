import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const models = {
  user: prisma.user,
};

export default prisma;
