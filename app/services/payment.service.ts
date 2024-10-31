import { BookingStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import prisma from "../../models/prisma";

class PaymentService {
  // Xử lý thanh toán
  async processPayment(data: {
    paymentID: string;
    bookingId: number;
    method: PaymentMethod;
  }) {
    // Kiểm tra xem đặt phòng có tồn tại không và lấy thông tin đặt phòng
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Tạo thanh toán với totalAmount từ booking
    const payment = await prisma.payment.create({
      data: {
        paymentID: data.paymentID,
        bookingId: data.bookingId,
        amount: booking.totalAmount, // Sử dụng totalAmount từ booking
        method: data.method,
        status: PaymentStatus.COMPLETED,
      },
    });

    // Cập nhật trạng thái đặt phòng thành CONFIRMED nếu thanh toán thành công
    await prisma.booking.update({
      where: { id: data.bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });

    return payment;
  }
}

export default new PaymentService();
