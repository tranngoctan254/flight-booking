import { Router } from "express";
import { Route } from ".";
import { FlightController } from "../../app/controllers/flight.controller";
import { RestActions } from "../enum";

export class FlightRoute {
  private static path = Router();
  private static flightController = new FlightController();

  public static draw() {
    this.path.route("/").get(this.flightController.index);

    Route.resource(this.path, this.flightController, {
      only: [RestActions.New, RestActions.Create],
    });

    this.path
      .route("/:id")
      .get(this.flightController.show)
      .put(this.flightController.update)
      .delete(this.flightController.destroy)
      .patch(this.flightController.edit);

    return this.path;
  }
}
