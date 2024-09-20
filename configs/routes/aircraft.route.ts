import { Router } from "express";
import { Route } from ".";
import { AircraftController } from "../../app/controllers/aircraft.controller";
import { RestActions } from "../enum";

export class AircraftRoute {
  private static path = Router();
  private static aircraftController = new AircraftController();

  public static draw() {
    this.path.route("/").get(this.aircraftController.index);

    Route.resource(this.path, this.aircraftController, {
      only: [RestActions.New, RestActions.Create],
    });

    this.path
      .route("/:id")
      .get(this.aircraftController.show)
      .put(this.aircraftController.update)
      .delete(this.aircraftController.destroy)
      .patch(this.aircraftController.edit);

    return this.path;
  }
}
