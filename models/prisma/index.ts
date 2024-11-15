import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const models = {
  user: prisma.user,
  role: prisma.role,
  room: prisma.room,
  service: prisma.service,
  booking: prisma.booking,
  payment: prisma.payment,
  bookingRooms: prisma.bookingRoom,
};

export default prisma;
