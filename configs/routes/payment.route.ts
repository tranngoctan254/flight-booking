import { Router } from "express";
import { PaymentController } from "../../app/controllers";
import { authenticate } from "../../app/middlewares/auth.middleware";
import { authorize } from "../../app/middlewares/role.middleware";

export class PaymentRoute {
  private static path = Router();
  private static paymentController = new PaymentController();

  public static draw() {
    this.path.post(
      "/",
      authenticate,
      authorize(["User", "Admin", "Manager"]),
      this.paymentController.createPayment
    );

    this.path.get(
      "/success",
      authenticate,
      authorize(["User", "Admin", "Manager"]),
      this.paymentController.paymentSuccess
    );

    this.path.post(
      "/cancel",
      authenticate,
      authorize(["User", "Admin", "Manager"]),
      this.paymentController.paymentCancel
    );

    this.path.post(
      "/refund",
      authenticate,
      authorize(["User", "Admin", "Manager"]),
      this.paymentController.refundPayment
    );

    this.path.post(
      "/refund",
      authenticate,
      authorize(["User", "Admin", "Manager"]),
      this.paymentController.refundPayment
    );

    return this.path;
  }
}
