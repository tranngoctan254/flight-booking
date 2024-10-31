import { Router } from "express";
import { BookingController } from "../../app/controllers";
import { authenticate } from "../../app/middlewares/auth.middleware";
import { authorize } from "../../app/middlewares/role.middleware";

export class BookingRoute {
  private static path = Router();
  private static bookingController = new BookingController();

  public static draw() {
    this.path.post("/", authenticate, this.bookingController.createBooking);

    this.path.get(
      "/",
      authenticate,
      authorize(["Admin", "Manager", "Sale"]),
      this.bookingController.getAllBookings
    );

    this.path.get(
      "/:id",
      authenticate,
      authorize(["Admin", "Manager", "Sale"]),
      this.bookingController.getBookingById
    );

    this.path.put(
      "/:id/status",
      authenticate,
      authorize(["Admin", "Manager"]),
      this.bookingController.updateBookingStatus
    );

    this.path.delete(
      "/:id",
      authenticate,
      authorize(["Admin"]),
      this.bookingController.deleteBooking
    );

    return this.path;
  }
}
