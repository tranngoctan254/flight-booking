import { Request, Response } from "express";
import BookingService from "../services/booking.service";

export class BookingController {
  async createBooking(req: Request, res: Response) {
    try {
      const { userId, startDate, endDate, rooms, services, promotionId } =
        req.body;

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

      // Tạo booking
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
      if (
        error.message === "Some rooms are not available for the selected dates."
      ) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getAllBookings(req: Request, res: Response) {
    try {
      const bookings = await BookingService.getAllBookings();
      res.status(200).json({ bookings });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

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
