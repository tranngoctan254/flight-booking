import { Router } from "express";
import { Route } from ".";
import { TicketController } from "../../app/controllers/ticket.controller";
import { RestActions } from "../enum";

export class TicketRoute {
  private static path = Router();
  private static ticketController = new TicketController();

  public static draw() {
    this.path.route("/").get(this.ticketController.index);

    Route.resource(this.path, this.ticketController, {
      only: [RestActions.New, RestActions.Create],
    });

    this.path
      .route("/:id")
      .get(this.ticketController.show)
      .put(this.ticketController.update)
      .delete(this.ticketController.destroy)
      .patch(this.ticketController.edit);

    this.path.route("/search").get(this.ticketController.search);

    this.path
      .route("/book")
      .get(this.ticketController.getBookingDetails)
      .post(this.ticketController.book);

    return this.path;
  }
}
