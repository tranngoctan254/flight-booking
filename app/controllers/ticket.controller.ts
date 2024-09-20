import models from "@models/prisma";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class TicketController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const tickets = await models.ticket.findMany({
      include: { Booking: true },
    });
    res.render("ticket.view/index", { tickets });
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
}
