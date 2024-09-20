import { Router } from "express";
import { Route } from ".";
import { PromotionController } from "../../app/controllers/promotion.controller";
import { RestActions } from "../enum";

export class PromotionRoute {
  private static path = Router();
  private static promotionController = new PromotionController();

  public static draw() {
    this.path.route("/").get(this.promotionController.index);

    Route.resource(this.path, this.promotionController, {
      only: [RestActions.New, RestActions.Create],
    });

    this.path
      .route("/:id")
      .get(this.promotionController.show)
      .put(this.promotionController.update)
      .delete(this.promotionController.destroy)
      .patch(this.promotionController.edit);

    return this.path;
  }
}
