import { Booking, BookingStatus } from "@prisma/client";
import prisma from "../../models/prisma";

class BookingService {
  // Tạo đặt phòng mới
  async createBooking(data: {
    userId: number;
    startDate: Date;
    endDate: Date;
    rooms: number[];
    services: { serviceId: number; quantity: number }[];
    promotionId?: number; // mã giảm giá nếu có
  }): Promise<Booking> {
    const totalRoomPrice = await this.calculateRoomPrice(
      data.rooms,
      data.startDate,
      data.endDate
    );
    const totalServicePrice = await this.calculateServicePrice(data.services);
    const totalAmount = totalRoomPrice + totalServicePrice;

    const bookingData: any = {
      bookingNumber: this.generateBookingNumber(),
      userId: data.userId,
      startDate: data.startDate,
      endDate: data.endDate,
      totalAmount,
      status: BookingStatus.PENDING,
      bookingRooms: {
        create: data.rooms.map((roomId) => ({
          room: { connect: { id: roomId } },
        })),
      },
      bookingServices: {
        create: await Promise.all(
          data.services.map(async (service) => ({
            service: { connect: { id: service.serviceId } },
            quantity: service.quantity,
            totalPrice:
              service.quantity *
              (await this.getServicePrice(service.serviceId)),
          }))
        ),
      },
    };

    // Tùy thuộc vào việc có mã giảm giá hay không
    if (data.promotionId) {
      bookingData.promotion = { connect: { id: data.promotionId } };
    }

    // Tạo đặt phòng
    const booking = await prisma.booking.create({
      data: bookingData,
      include: { bookingRooms: true, bookingServices: true },
    });

    // Cập nhật trạng thái isAvailable cho các phòng
    await prisma.room.updateMany({
      where: { id: { in: data.rooms } },
      data: { isAvailable: false },
    });

    return booking;
  }

  // Lấy danh sách tất cả các đặt phòng
  async getAllBookings(): Promise<Booking[]> {
    return await prisma.booking.findMany({
      include: {
        user: true,
        bookingRooms: { include: { room: true } },
        bookingServices: { include: { service: true } },
      },
    });
  }

  // Lấy đặt phòng theo ID
  async getBookingById(id: number): Promise<Booking | null> {
    return await prisma.booking.findUnique({
      where: { id },
      include: {
        user: true,
        bookingRooms: { include: { room: true } },
        bookingServices: { include: { service: true } },
      },
    });
  }

  // Cập nhật trạng thái đặt phòng
  async updateBookingStatus(
    id: number,
    status: BookingStatus
  ): Promise<Booking> {
    return await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        user: true,
        bookingRooms: { include: { room: true } },
        bookingServices: { include: { service: true } },
      },
    });
  }

  // Xóa đặt phòng
  async deleteBooking(id: number): Promise<Booking> {
    // Kiểm tra đặt phòng có tồn tại không
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        bookingRooms: true,
        bookingServices: true,
      },
    });

    if (!booking) {
      throw new Error("Booking not found");
    }

    // Xóa các dịch vụ liên quan
    await prisma.bookingService.deleteMany({
      where: { bookingId: id },
    });

    // Xóa các phòng liên quan
    await prisma.bookingRoom.deleteMany({
      where: { bookingId: id },
    });

    // Cuối cùng xóa đặt phòng
    return await prisma.booking.delete({
      where: { id },
    });
  }

  // Tính giá phòng dựa trên ngày và danh sách phòng
  private async calculateRoomPrice(
    rooms: number[],
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    const roomPrices = await prisma.room.findMany({
      where: { id: { in: rooms } },
      select: { price: true },
    });
    const numberOfNights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return roomPrices.reduce(
      (total, room) => total + room.price * numberOfNights,
      0
    );
  }

  // Tính giá dịch vụ dựa trên danh sách dịch vụ
  private async calculateServicePrice(
    services: { serviceId: number; quantity: number }[]
  ): Promise<number> {
    const servicePrices = await Promise.all(
      services.map(async (service) => {
        const price = await this.getServicePrice(service.serviceId);
        return price * service.quantity;
      })
    );
    return servicePrices.reduce((total, price) => total + price, 0);
  }

  // Lấy giá dịch vụ
  private async getServicePrice(serviceId: number): Promise<number> {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { price: true },
    });
    return service?.price || 0;
  }

  // Sinh số đặt phòng duy nhất
  private generateBookingNumber(): string {
    return `BOOK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  }
}

export default new BookingService();
