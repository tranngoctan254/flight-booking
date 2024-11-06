import { PaymentMethod } from "@prisma/client";
import { Request, Response } from "express";
import PaymentService from "../services/payment.service";

export class PaymentController {
  async processPayment(req: Request, res: Response) {
    try {
      const { paymentID, bookingId, method } = req.body;

      if (!paymentID || !bookingId || !method) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const payment = await PaymentService.processPayment({
        paymentID,
        bookingId,
        method: method as PaymentMethod,
      });

      res
        .status(201)
        .json({ message: "Payment processed successfully", payment });
    } catch (error: any) {
      if (error.message === "Booking not found") {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
