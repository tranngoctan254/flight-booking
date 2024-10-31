import { Router } from "express";
import { PaymentController } from "../../app/controllers/payment.controller";
import { authenticate } from "../../app/middlewares/auth.middleware";

export class PaymentRoute {
  private static path = Router();
  private static paymentController = new PaymentController();

  public static draw() {
    this.path.post("/", authenticate, this.paymentController.processPayment);

    return this.path;
  }
}
