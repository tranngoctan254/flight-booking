import models from "@models/prisma";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class PaymentController extends ApplicationController {
  public async index(req: Request, res: Response) {
    try {
      const payments = await models.payment.findMany({
        include: { Booking: true },
      });
      res.render("payment.view/index", { payments });
    } catch (error) {
      req.flash("errors", { msg: "Could not fetch payments." });
      res.redirect("/payments");
    }
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;
    const payment = await models.payment.findUnique({
      where: { payment_id: Number(id) },
      include: { Booking: true },
    });

    if (!payment) {
      req.flash("errors", { msg: `Payment ${id} is not found.` });
      return res.redirect("/payments");
    }

    res.render("payment.view/show", { payment });
  }

  public async new(req: Request, res: Response) {
    const bookings = await models.booking.findMany();
    res.render("payment.view/new", { bookings });
  }

  public async create(req: Request, res: Response) {
    const { booking_id, payment_method, amount } = req.body;

    // Kiểm tra đầu vào
    if (!booking_id || !payment_method || isNaN(Number(amount))) {
      req.flash("errors", { msg: "Invalid input." });
      return res.redirect("/payments/new");
    }

    try {
      await models.payment.create({
        data: {
          booking_id: Number(booking_id),
          payment_method,
          amount: Number(amount),
        },
      });
      req.flash("success", {
        msg: `Created payment for booking ${booking_id}`,
      });
      res.redirect("/payments");
    } catch (error) {
      req.flash("errors", { msg: "Failed to create payment." });
      res.redirect("/payments/new");
    }
  }

  public async edit(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const payment = await models.payment.findUnique({
        where: { payment_id: Number(id) },
        include: { Booking: true },
      });

      if (!payment) {
        req.flash("errors", { msg: `Payment ${id} is not found.` });
        return res.redirect("/payments");
      }

      const bookings = await models.booking.findMany();
      res.render("payment.view/edit", { payment, bookings });
    } catch (error) {
      req.flash("errors", { msg: "Could not fetch payment details." });
      res.redirect("/payments");
    }
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { booking_id, payment_method, amount } = req.body;

    // Kiểm tra đầu vào
    if (!booking_id || !payment_method || isNaN(Number(amount))) {
      req.flash("errors", { msg: "Invalid input." });
      return res.redirect(`/payments/${id}/edit`);
    }

    try {
      await models.payment.update({
        where: { payment_id: Number(id) },
        data: {
          booking_id: Number(booking_id),
          payment_method,
          amount: Number(amount),
        },
      });
      req.flash("success", {
        msg: `Updated payment for booking ${booking_id}`,
      });
      res.redirect("/payments");
    } catch (error) {
      req.flash("errors", { msg: "Failed to update payment." });
      res.redirect(`/payments/${id}/edit`);
    }
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await models.payment.delete({ where: { payment_id: Number(id) } });
      req.flash("success", { msg: `Deleted payment ${id}` });
    } catch (error) {
      req.flash("errors", { msg: "Failed to delete payment." });
    }

    res.redirect("/payments");
  }
}
