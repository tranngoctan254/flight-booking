import { BookingController } from "@controllers";
import { Router } from "express";
import { Route } from ".";
import { RestActions } from "../enum";

export class BookingRoute {
  private static path = Router();
  private static bookingController = new BookingController();

  public static draw() {
    this.path.route("/").get(this.bookingController.index);

    Route.resource(this.path, this.bookingController, {
      only: [RestActions.New, RestActions.Create],
    });

    this.path
      .route("/:id")
      .get(this.bookingController.show)
      .put(this.bookingController.update)
      .delete(this.bookingController.destroy)
      .patch(this.bookingController.edit);

    this.path.route("/report").get(this.bookingController.report);

    return this.path;
  }
}
