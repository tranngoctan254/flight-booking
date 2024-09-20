import { Router } from "express";
import { Route } from ".";
import { RouteController } from "../../app/controllers/route.controller";
import { RestActions } from "../enum";

export class RouteRoute {
  private static path = Router();
  private static routeController = new RouteController();

  public static draw() {
    this.path.route("/").get(this.routeController.index);

    Route.resource(this.path, this.routeController, {
      only: [RestActions.New, RestActions.Create],
    });

    this.path
      .route("/:id")
      .get(this.routeController.show)
      .put(this.routeController.update)
      .delete(this.routeController.destroy)
      .patch(this.routeController.edit);

    return this.path;
  }
}
