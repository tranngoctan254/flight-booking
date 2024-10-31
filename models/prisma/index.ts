import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const models = {
  user: prisma.user,
  role: prisma.role,
  room: prisma.room,
  service: prisma.service,
  booking: prisma.service,
  payment: prisma.service,
  bookingRooms: prisma.bookingRoom,
};

export default prisma;
