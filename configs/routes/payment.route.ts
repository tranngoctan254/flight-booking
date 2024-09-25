import { PaymentController } from "@controllers";
import { Router } from "express";
import { Route } from ".";
import { RestActions } from "../enum";

export class PaymentRoute {
  private static path = Router();
  private static paymentController = new PaymentController();

  public static draw() {
    this.path.route("/").get(this.paymentController.index);

    Route.resource(this.path, this.paymentController, {
      only: [RestActions.New, RestActions.Create],
    });

    this.path
      .route("/:id")
      .get(this.paymentController.show)
      .put(this.paymentController.update)
      .delete(this.paymentController.destroy)
      .patch(this.paymentController.edit);

    return this.path;
  }
}
