import { RoomSize, RoomType } from "@prisma/client";
import { Request, Response } from "express";
import RoomService from "../services/room.service";

export class RoomController {
  async createRoom(req: Request, res: Response) {
    try {
      const { roomID, description, type, size, price, pictures } = req.body;

      if (!roomID || !description || !type || !size || !price || !pictures) {
        return res.status(400).json({ message: "All fields are required" });
      }

      if (!Array.isArray(pictures)) {
        return res
          .status(400)
          .json({ message: "Pictures must be an array of URLs" });
      }

      const room = await RoomService.createRoom({
        roomID,
        description,
        type,
        size,
        price,
        pictures,
      });

      res.status(201).json({
        message: "Room created successfully",
        room,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "RoomID already exists" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getAllRooms(req: Request, res: Response) {
    try {
      const rooms = await RoomService.getAllRooms();
      res.status(200).json({ rooms });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getRoomById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }

      const room = await RoomService.getRoomById(id);

      if (!room) {
        return res.status(404).json({ message: "Room not found" });
      }

      res.status(200).json({ room });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async updateRoom(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { roomID, description, type, size, price, pictures } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid room ID" });
      }

      if (pictures && !Array.isArray(pictures)) {
        return res
          .status(400)
          .json({ message: "Pictures must be an array of URLs" });
      }

      const updatedRoom = await RoomService.updateRoom(id, {
        roomID,
        description,
        type,
        size,
        price,
        pictures,
      });

      res.status(200).json({
        message: "Room updated successfully",
        room: updatedRoom,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "RoomID already exists" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async deleteRoom(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "ID phòng không hợp lệ" });
      }

      const deletedRoom = await RoomService.deleteRoom(id);

      res.status(200).json({
        message: "Xóa phòng thành công",
        room: deletedRoom,
      });
    } catch (error: any) {
      if (error.message === "Không thể xóa phòng có đặt phòng tồn tại") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
    }
  }

  async searchRooms(req: Request, res: Response) {
    try {
      const { description, type, size, minPrice, maxPrice, available } =
        req.query;

      const searchParams = {
        description: description ? String(description) : undefined,
        type: type ? (type as RoomType) : undefined,
        size: size ? (size as RoomSize) : undefined,
        minPrice: minPrice ? parseFloat(String(minPrice)) : undefined,
        maxPrice: maxPrice ? parseFloat(String(maxPrice)) : undefined,
        available: available !== undefined ? available === "true" : undefined, // Chuyển đổi chuỗi thành boolean
      };

      const rooms = await RoomService.searchRooms(searchParams);
      res.status(200).json({ rooms });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
