import models from "@models/prisma";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class FlightController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const flights = await models.flight.findMany({
      include: {
        Route: true,
        Aircraft: true,
        Promotion: true,
      },
    });
    res.render("flight.view/index", { flights });
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;
    const flight = await models.flight.findUnique({
      where: { flight_id: Number(id) },
      include: {
        Route: true,
        Aircraft: true,
        Promotion: true,
      },
    });

    if (!flight) {
      req.flash("errors", { msg: `Flight ${id} is not found.` });
      return res.redirect("/flights");
    }

    res.render("flight.view/show", { flight });
  }

  public async new(req: Request, res: Response) {
    const routes = await models.route.findMany();
    const aircrafts = await models.aircraft.findMany();
    res.render("flight.view/new", { routes, aircrafts });
  }

  public async create(req: Request, res: Response) {
    const {
      route_id,
      aircraft_id,
      flight_date,
      flight_time,
      ticket_type,
      promotion_id,
    } = req.body;

    await models.flight.create({
      data: {
        route_id: Number(route_id),
        aircraft_id: Number(aircraft_id),
        flight_date: new Date(flight_date),
        flight_time: new Date(flight_time),
        ticket_type,
        promotion_id: promotion_id ? Number(promotion_id) : null,
      },
    });

    req.flash("success", { msg: `Created flight on ${flight_date}` });
    res.redirect("/flights");
  }

  public async edit(req: Request, res: Response) {
    const { id } = req.params;
    const flight = await models.flight.findUnique({
      where: { flight_id: Number(id) },
      include: {
        Route: true,
        Aircraft: true,
        Promotion: true,
      },
    });

    if (!flight) {
      req.flash("errors", { msg: `Flight ${id} is not found.` });
      return res.redirect("/flights");
    }

    const routes = await models.route.findMany();
    const aircrafts = await models.aircraft.findMany();
    res.render("flight.view/edit", { flight, routes, aircrafts });
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      route_id,
      aircraft_id,
      flight_date,
      flight_time,
      ticket_type,
      promotion_id,
    } = req.body;

    await models.flight.update({
      where: { flight_id: Number(id) },
      data: {
        route_id: Number(route_id),
        aircraft_id: Number(aircraft_id),
        flight_date: new Date(flight_date),
        flight_time: new Date(flight_time),
        ticket_type,
        promotion_id: promotion_id ? Number(promotion_id) : null,
      },
    });

    req.flash("success", { msg: `Updated flight on ${flight_date}` });
    res.redirect("/flights");
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;

    await models.flight.delete({ where: { flight_id: Number(id) } });
    req.flash("success", { msg: `Deleted flight ${id}` });
    res.redirect("/flights");
  }
}
