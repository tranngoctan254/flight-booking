import { Request, Response } from "express";
import BookingService from "../services/booking.service";

export class BookingController {
  // Tạo đặt phòng mới
  async createBooking(req: Request, res: Response) {
    try {
      const { userId, startDate, endDate, rooms, services, promotionId } =
        req.body;

      // Kiểm tra dữ liệu đầu vào
      if (
        typeof userId !== "number" ||
        !startDate ||
        !endDate ||
        !Array.isArray(rooms) ||
        !Array.isArray(services)
      ) {
        return res.status(400).json({
          message:
            "Invalid input. All fields are required and must be correctly formatted.",
        });
      }

      const booking = await BookingService.createBooking({
        userId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        rooms,
        services,
        promotionId,
      });

      res
        .status(201)
        .json({ message: "Booking created successfully", booking });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Lấy danh sách tất cả các đặt phòng
  async getAllBookings(req: Request, res: Response) {
    try {
      const bookings = await BookingService.getAllBookings();
      res.status(200).json({ bookings });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Lấy đặt phòng theo ID
  async getBookingById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }

      const booking = await BookingService.getBookingById(id);

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      res.status(200).json({ booking });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Cập nhật trạng thái đặt phòng
  async updateBookingStatus(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const updatedBooking = await BookingService.updateBookingStatus(
        id,
        status
      );

      res.status(200).json({
        message: "Booking status updated successfully",
        booking: updatedBooking,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Xóa đặt phòng
  async deleteBooking(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid booking ID" });
      }

      const deletedBooking = await BookingService.deleteBooking(id);

      res.status(200).json({
        message: "Booking deleted successfully",
        booking: deletedBooking,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
