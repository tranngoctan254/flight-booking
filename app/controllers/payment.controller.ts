import { Request, Response } from "express";
import prisma from "../../models/prisma";
import PaymentService from "../services/payment.service";

export class PaymentController {
  // Tạo thanh toán qua PayPal
  async createPayment(req: Request, res: Response) {
    try {
      const { bookingId, method } = req.body;

      if (!bookingId || !method) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Lấy thông tin booking từ cơ sở dữ liệu
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
      });

      // Kiểm tra xem booking có tồn tại và lấy totalAmount
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      const amount = booking.totalAmount;

      // Gọi PaymentService để tạo payment
      const payment = await PaymentService.createPayment({
        bookingId,
        amount,
        method,
      });
      // const { payment, approveUrl } = await PaymentService.createPayment({
      //   bookingId,
      //   amount,
      //   method,
      // });

      res.status(201).json({ message: "Payment created", payment });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Thêm phương thức xử lý cho thanh toán thành công
  async paymentSuccess(req: Request, res: Response) {
    try {
      // Lấy paymentId từ query parameters
      const { token, PayerID } = req.query;

      if (!token || !PayerID) {
        return res
          .status(400)
          .json({ message: "Token and PayerID are required" });
      }

      // Giả sử bạn lấy paymentId từ token (hoặc lưu paymentId trong session, DB, v.v.)
      // Để xử lý việc thanh toán, bạn cần gọi PaymentService với `token` hoặc `PayerID` từ PayPal

      // Cần lấy paymentId từ cơ sở dữ liệu hoặc từ session/cookie
      const paymentId = await prisma.payment.findUnique({
        where: {
          paymentID: token as string, // Hoặc lấy từ DB nếu bạn lưu thông tin này
        },
      });

      if (!paymentId) {
        return res.status(404).json({ message: "Payment not found" });
      }

      // Xử lý thanh toán thành công bằng cách gọi PaymentService
      const payment = await PaymentService.handlePaymentCapture(
        paymentId.paymentID
      );

      // Trả về thông tin thanh toán đã hoàn tất
      res
        .status(200)
        .json({ message: "Payment completed successfully", payment });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Thêm phương thức xử lý khi người dùng hủy thanh toán
  async paymentCancel(req: Request, res: Response) {
    try {
      // Lấy paymentId từ query parameters
      const { paymentId } = req.query;

      if (!paymentId) {
        return res.status(400).json({ message: "Payment ID is required" });
      }

      // Hủy thanh toán (cập nhật trạng thái Payment là CANCELLED)
      const payment = await PaymentService.cancelPayment(paymentId as string);

      // Trả về thông báo hủy thành công
      res.status(200).json({ message: "Payment canceled", payment });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Hoàn tiền (Refund) cho thanh toán
  async refundPayment(req: Request, res: Response) {
    try {
      // Lấy paymentId từ query parameters
      const { paymentId } = req.query;

      if (!paymentId) {
        return res.status(400).json({ message: "Payment ID is required" });
      }

      // Gọi PaymentService để hoàn tiền
      const refundedPayment = await PaymentService.refundPayment(
        paymentId as string
      );

      // Trả về thông báo hoàn tiền thành công
      res
        .status(200)
        .json({ message: "Payment refunded successfully", refundedPayment });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
