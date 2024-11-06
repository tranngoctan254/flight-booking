import { Prisma, Room, RoomSize, RoomType } from "@prisma/client";
import { models } from "../../models/prisma";

class RoomService {
  async createRoom(data: {
    roomID: string;
    description: string;
    type: RoomType;
    size: RoomSize;
    price: number;
    pictures: string[];
  }): Promise<Room> {
    return await models.room.create({
      data: {
        roomID: data.roomID,
        description: data.description,
        type: data.type,
        size: data.size,
        price: data.price,
        pictures: {
          create: data.pictures.map((url) => ({ url })),
        },
      },
      include: { pictures: true },
    });
  }

  async getAllRooms(): Promise<Room[]> {
    return await models.room.findMany({
      include: { pictures: true },
    });
  }

  async getRoomById(id: number): Promise<Room | null> {
    return await models.room.findUnique({
      where: { id },
      include: { pictures: true },
    });
  }

  async updateRoom(
    id: number,
    data: {
      roomID?: string;
      description?: string;
      type?: RoomType;
      size?: RoomSize;
      price?: number;
      pictures?: string[];
    }
  ): Promise<Room> {
    const updateData: Prisma.RoomUpdateInput = {};

    if (data.roomID) updateData.roomID = data.roomID;
    if (data.description) updateData.description = data.description;
    if (data.type) updateData.type = data.type;
    if (data.size) updateData.size = data.size;
    if (data.price) updateData.price = data.price;
    if (data.pictures) {
      updateData.pictures = {
        deleteMany: {},
        create: data.pictures.map((url) => ({ url })),
      };
    }

    return await models.room.update({
      where: { id },
      data: updateData,
      include: { pictures: true },
    });
  }

  async deleteRoom(id: number): Promise<Room> {
    const bookingRooms = await models.bookingRooms.findMany({
      where: { roomId: id },
    });

    if (bookingRooms.length > 0) {
      throw new Error("Cannot delete room with existing bookings");
    }

    return await models.room.delete({
      where: { id },
      include: { pictures: true },
    });
  }

  async searchRooms(params: {
    description?: string;
    type?: RoomType;
    size?: RoomSize;
    minPrice?: number;
    maxPrice?: number;
    available?: boolean;
  }): Promise<Room[]> {
    const whereClause: Prisma.RoomWhereInput = {
      isAvailable: params.available !== undefined ? params.available : true,
    };

    if (params.description) {
      whereClause.description = {
        contains: params.description,
      };
    }

    if (params.type) {
      whereClause.type = params.type;
    }

    if (params.size) {
      whereClause.size = params.size;
    }

    if (params.minPrice !== undefined || params.maxPrice !== undefined) {
      whereClause.price = {
        ...(params.minPrice !== undefined ? { gte: params.minPrice } : {}),
        ...(params.maxPrice !== undefined ? { lte: params.maxPrice } : {}),
      };
    }

    return await models.room.findMany({
      where: whereClause,
      include: { pictures: true },
    });
  }
}

export default new RoomService();
