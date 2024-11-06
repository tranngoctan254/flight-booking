import { BookingStatus, PaymentMethod, PaymentStatus } from "@prisma/client";
import prisma from "../../models/prisma";

class PaymentService {
  async processPayment(data: {
    paymentID: string;
    bookingId: number;
    method: PaymentMethod;
  }) {
    const booking = await prisma.booking.findUnique({
      where: { id: data.bookingId },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    const payment = await prisma.payment.create({
      data: {
        paymentID: data.paymentID,
        bookingId: data.bookingId,
        amount: booking.totalAmount,
        method: data.method,
        status: PaymentStatus.COMPLETED,
      },
    });

    await prisma.booking.update({
      where: { id: data.bookingId },
      data: { status: BookingStatus.CONFIRMED },
    });

    return payment;
  }
}

export default new PaymentService();
