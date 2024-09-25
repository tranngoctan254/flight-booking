import models from "@models/prisma";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class BookingController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const bookings = await models.booking.findMany({
      include: { User: true, Flight: true, Tickets: true },
    });
    res.render("booking.view/index", { bookings });
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;
    const booking = await models.booking.findUnique({
      where: { booking_id: Number(id) },
      include: { User: true, Flight: true, Tickets: true },
    });

    if (!booking) {
      req.flash("errors", { msg: `Booking ${id} is not found.` });
      return res.redirect("/bookings");
    }

    res.render("booking.view/show", { booking });
  }

  public async new(req: Request, res: Response) {
    const flights = await models.flight.findMany();
    const users = await models.user.findMany();
    res.render("booking.view/new", { flights, users });
  }

  public async create(req: Request, res: Response) {
    const { user_id, flight_id, total_price, booking_code } = req.body;

    await models.booking.create({
      data: {
        user_id: Number(user_id),
        flight_id: Number(flight_id),
        total_price: Number(total_price),
        booking_code,
        payment_status: "pending",
      },
    });

    req.flash("success", { msg: `Created booking with code ${booking_code}` });
    res.redirect("/bookings");
  }

  public async edit(req: Request, res: Response) {
    const { id } = req.params;
    const booking = await models.booking.findUnique({
      where: { booking_id: Number(id) },
      include: { User: true, Flight: true },
    });

    if (!booking) {
      req.flash("errors", { msg: `Booking ${id} is not found.` });
      return res.redirect("/bookings");
    }

    const flights = await models.flight.findMany();
    const users = await models.user.findMany();
    res.render("booking.view/edit", { booking, flights, users });
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { user_id, flight_id, total_price, booking_code } = req.body;

    await models.booking.update({
      where: { booking_id: Number(id) },
      data: {
        user_id: Number(user_id),
        flight_id: Number(flight_id),
        total_price: Number(total_price),
        booking_code,
      },
    });

    req.flash("success", { msg: `Updated booking with code ${booking_code}` });
    res.redirect("/bookings");
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;

    await models.booking.delete({ where: { booking_id: Number(id) } });
    req.flash("success", { msg: `Deleted booking ${id}` });
    res.redirect("/bookings");
  }

  public async check_booking(req: Request, res: Response) {
    const { booking_id } = req.params; // Lấy booking_id từ tham số

    const booking = await models.booking.findUnique({
      where: { booking_id: Number(booking_id) },
      include: { User: true, Flight: true, Tickets: true },
    });

    if (!booking) {
      req.flash("errors", { msg: `Booking ${booking_id} not found.` });
      return res.redirect("/bookings");
    }

    res.render("booking.view/check", { booking });
  }

  public async report(req: Request, res: Response) {
    const bookings = await models.booking.findMany({
      include: { User: true, Flight: true, Tickets: true },
    });

    res.render("booking.view/report", { bookings });
  }
}
