import { Router } from "express";
import promotionController from "../../app/controllers/promotion.controller";
import { authenticate } from "../../app/middlewares/auth.middleware";
import { authorize } from "../../app/middlewares/role.middleware";

export class PromotionRoute {
  private static path = Router();
  private static promotionController = promotionController;

  public static draw() {
    // Route tạo mới khuyến mãi
    this.path.post(
      "/",
      authenticate,
      authorize(["Admin", "Manager"]),
      this.promotionController.createPromotion
    );

    // Route lấy tất cả khuyến mãi
    this.path.get(
      "/",
      authenticate,
      authorize(["Admin", "Manager", "Sale"]),
      this.promotionController.getAllPromotions
    );

    // Route lấy khuyến mãi theo ID
    this.path.get(
      "/:id",
      authenticate,
      authorize(["Admin", "Manager", "Sale"]),
      this.promotionController.getPromotionById
    );

    // Route cập nhật khuyến mãi
    this.path.put(
      "/:id",
      authenticate,
      authorize(["Admin", "Manager"]),
      this.promotionController.updatePromotion
    );

    // Route xóa khuyến mãi
    this.path.delete(
      "/:id",
      authenticate,
      authorize(["Admin"]),
      this.promotionController.deletePromotion
    );

    return this.path;
  }
}
