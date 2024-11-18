import { Payment, PaymentMethod, PaymentStatus } from "@prisma/client";
import prisma from "../../models/prisma";
import { client, paypal } from "../utils/paypal.client";

class PaymentService {
  // Tạo Payment và gửi yêu cầu thanh toán qua PayPal
  async createPayment(paymentData: {
    bookingId: number;
    amount: number;
    method: PaymentMethod;
  }): Promise<Payment> {
    const { bookingId, amount, method } = paymentData;

    try {
      // Cấu hình các URL để PayPal điều hướng
      const returnUrl = `http://localhost:3000/payments/success`;
      const cancelUrl = `http://localhost:3000/payments/cancel`;

      // Tạo yêu cầu thanh toán PayPal
      const request = new paypal.orders.OrdersCreateRequest();
      request.requestBody({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: amount.toString(),
            },
          },
        ],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      });

      const order = await client().execute(request);

      // Tìm kiếm approve link trong phản hồi từ PayPal
      const approveLink = order.result.links.find(
        (link: any) => link.rel === "approve"
      );

      if (!approveLink) {
        throw new Error("Approve link not found in PayPal response.");
      }

      // Tạo Payment trong database và lưu approveUrl
      const payment = await prisma.payment.create({
        data: {
          paymentID: order.result.id,
          bookingId,
          amount,
          method,
          status: PaymentStatus.PENDING,
          transactionID: null,
          approveUrl: approveLink.href,
        },
      });

      return payment;
    } catch (error: any) {
      throw new Error(`Error creating PayPal payment: ${error.message}`);
    }
  }

  // Xử lý kết quả từ PayPal sau khi thanh toán
  async handlePaymentCapture(paymentId: string): Promise<Payment> {
    try {
      // Lấy thông tin thanh toán từ PayPal
      const request = new paypal.orders.OrdersCaptureRequest(paymentId);
      const captureResponse = await client().execute(request);

      // Kiểm tra xem có captures trong phản hồi của PayPal không
      const captures =
        captureResponse.result.purchase_units[0].payments.captures;

      if (!captures || captures.length === 0) {
        throw new Error("No capture found in the PayPal response.");
      }

      // Lấy captureId từ PayPal
      const captureId = captures[0].id;

      // Kiểm tra trạng thái thanh toán từ PayPal
      const status =
        captureResponse.result.status === "COMPLETED"
          ? PaymentStatus.COMPLETED
          : PaymentStatus.FAILED;

      // Cập nhật payment với transactionID và status
      const payment = await prisma.payment.update({
        where: { paymentID: paymentId },
        data: {
          status,
          transactionID: captureId, // Lưu captureId vào transactionID
        },
      });

      return payment;
    } catch (error: any) {
      throw new Error(`Error capturing payment: ${error.message}`);
    }
  }

  async cancelPayment(paymentId: string): Promise<Payment> {
    try {
      const payment = await prisma.payment.update({
        where: { paymentID: paymentId },
        data: { status: PaymentStatus.CANCELLED },
      });

      return payment;
    } catch (error: any) {
      throw new Error(`Error canceling payment: ${error.message}`);
    }
  }

  // Hoàn tiền cho thanh toán
  async refundPayment(paymentId: string): Promise<Payment> {
    try {
      // Lấy thông tin thanh toán từ PayPal
      const payment = await prisma.payment.findUnique({
        where: { paymentID: paymentId },
      });

      if (!payment || !payment.transactionID) {
        throw new Error("Payment or transaction not found.");
      }

      // Tạo request hoàn tiền
      const captureId = payment.transactionID; // captureId đã được lưu trong database khi thanh toán thành công
      const request = new paypal.payments.CapturesRefundRequest(captureId);

      // Gửi yêu cầu hoàn tiền đến PayPal
      const refundResponse = await client().execute(request);

      // Kiểm tra xem hoàn tiền có thành công không
      if (refundResponse.result.status === "COMPLETED") {
        // Cập nhật trạng thái thanh toán trong database thành refunded
        const refundedPayment = await prisma.payment.update({
          where: { paymentID: paymentId },
          data: {
            status: PaymentStatus.REFUNDED, // Trạng thái đã hoàn tiền
          },
        });

        return refundedPayment;
      } else {
        throw new Error("Refund failed: " + refundResponse.result.status);
      }
    } catch (error: any) {
      throw new Error(`Error refunding payment: ${error.message}`);
    }
  }
}

export default new PaymentService();
