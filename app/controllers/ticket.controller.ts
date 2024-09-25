import models from "@models/prisma";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class TicketController extends ApplicationController {
  public async index(req: Request, res: Response) {
    try {
      const tickets = await models.ticket.findMany({
        include: { Booking: true },
      });
      res.render("ticket.view/index", { tickets });
    } catch (error) {
      req.flash("errors", { msg: "Could not fetch tickets." });
      res.redirect("/tickets");
    }
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;
    const ticket = await models.ticket.findUnique({
      where: { ticket_id: Number(id) },
      include: { Booking: true },
    });

    if (!ticket) {
      req.flash("errors", { msg: `Ticket ${id} is not found.` });
      return res.redirect("/tickets");
    }

    res.render("ticket.view/show", { ticket });
  }

  public async new(req: Request, res: Response) {
    const bookings = await models.booking.findMany();
    res.render("ticket.view/new", { bookings });
  }

  public async create(req: Request, res: Response) {
    const { booking_id, passenger_name, seat_number, ticket_price } = req.body;

    if (!passenger_name || !seat_number || isNaN(Number(ticket_price))) {
      req.flash("errors", { msg: "Invalid input." });
      return res.redirect("/tickets/new");
    }

    await models.ticket.create({
      data: {
        booking_id: Number(booking_id),
        passenger_name,
        seat_number,
        ticket_price: Number(ticket_price),
      },
    });

    req.flash("success", { msg: `Created ticket for ${passenger_name}` });
    res.redirect("/tickets");
  }

  public async edit(req: Request, res: Response) {
    const { id } = req.params;
    const ticket = await models.ticket.findUnique({
      where: { ticket_id: Number(id) },
      include: { Booking: true },
    });

    if (!ticket) {
      req.flash("errors", { msg: `Ticket ${id} is not found.` });
      return res.redirect("/tickets");
    }

    const bookings = await models.booking.findMany();
    res.render("ticket.view/edit", { ticket, bookings });
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { booking_id, passenger_name, seat_number, ticket_price } = req.body;

    await models.ticket.update({
      where: { ticket_id: Number(id) },
      data: {
        booking_id: Number(booking_id),
        passenger_name,
        seat_number,
        ticket_price: Number(ticket_price),
      },
    });

    req.flash("success", { msg: `Updated ticket for ${passenger_name}` });
    res.redirect("/tickets");
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;

    await models.ticket.delete({ where: { ticket_id: Number(id) } });
    req.flash("success", { msg: `Deleted ticket ${id}` });
    res.redirect("/tickets");
  }

  public async search(req: Request, res: Response) {
    const { id } = req.query; // Lấy ticket_id từ query string

    // Kiểm tra xem ticket_id có được cung cấp không
    if (!id) {
      req.flash("errors", { msg: "Ticket ID is required." });
      return res.redirect("/tickets");
    }

    const ticketId = Number(id); // Chuyển đổi id thành số

    // Kiểm tra xem ticketId có hợp lệ không
    if (isNaN(ticketId)) {
      req.flash("errors", { msg: "Invalid Ticket ID." });
      return res.redirect("/tickets");
    }

    const ticket = await models.ticket.findUnique({
      where: { ticket_id: ticketId }, // Tìm kiếm bằng ticket_id
      include: { Booking: true },
    });

    if (!ticket) {
      req.flash("errors", { msg: `Ticket with ID ${ticketId} not found.` });
      return res.redirect("/tickets");
    }

    res.render("ticket.view/show", { ticket });
  }

  public async getBookingDetails(req: Request, res: Response) {
    const bookings = await models.booking.findMany(); // Lấy danh sách booking
    res.render("ticket.view/book", { bookings });
  }

  public async book(req: Request, res: Response) {
    const { booking_id, passenger_name, seat_number, ticket_price } = req.body;

    // Tạo vé mới
    const ticket = await models.ticket.create({
      data: {
        booking_id: Number(booking_id),
        passenger_name,
        seat_number,
        ticket_price: Number(ticket_price),
      },
    });

    req.flash("success", { msg: `Booked ticket for ${passenger_name}` });
    res.redirect("/tickets");
  }

  public async print_ticket(req: Request, res: Response) {
    const { id } = req.params;

    const ticket = await models.ticket.findUnique({
      where: { ticket_id: Number(id) },
      include: { Booking: true },
    });

    if (!ticket) {
      req.flash("errors", { msg: `Ticket ${id} not found.` });
      return res.redirect("/tickets");
    }

    res.render("ticket.view/print", { ticket });
  }
}
