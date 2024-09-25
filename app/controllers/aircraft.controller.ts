import models from "@models/prisma";
import { Request, Response } from "express";
import { ApplicationController } from "./application.controller";

export class AircraftController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const aircrafts = await models.aircraft.findMany();
    res.render("aircraft.view/index", { aircrafts: aircrafts });
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;

    const aircraft = await models.aircraft.findUnique({
      where: { aircraft_id: Number(id) },
    });

    if (!aircraft) {
      req.flash("errors", { msg: `Aircraft ${id} is not found.` });
      return res.redirect("/aircrafts");
    }

    res.render("aircraft.view/show", { aircraft });
  }

  public async new(req: Request, res: Response) {
    res.render("aircraft.view/new");
  }

  public async create(req: Request, res: Response) {
    const {
      aircraft_number,
      aircraft_name,
      num_commercial_seats,
      num_vip_seats,
    } = req.body;

    await models.aircraft.create({
      data: {
        aircraft_number,
        aircraft_name,
        num_commercial_seats: Number(num_commercial_seats),
        num_vip_seats: Number(num_vip_seats),
      },
    });

    req.flash("success", { msg: `Created aircraft ${aircraft_name}` });
    res.redirect("/aircrafts");
  }

  public async edit(req: Request, res: Response) {
    const { id } = req.params;

    const aircraft = await models.aircraft.findUnique({
      where: { aircraft_id: Number(id) },
    });

    if (!aircraft) {
      req.flash("errors", { msg: `Aircraft ${id} is not found.` });
      return res.redirect("/aircrafts");
    }

    res.render("aircraft.view/edit", { aircraft });
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      aircraft_number,
      aircraft_name,
      num_commercial_seats,
      num_vip_seats,
    } = req.body;

    const existingAircraft = await models.aircraft.findUnique({
      where: { aircraft_id: Number(id) },
    });

    if (!existingAircraft) {
      req.flash("errors", { msg: `Aircraft ${id} is not found.` });
      return res.redirect("/aircrafts");
    }

    await models.aircraft.update({
      where: { aircraft_id: Number(id) },
      data: {
        aircraft_number,
        aircraft_name,
        num_commercial_seats: Number(num_commercial_seats),
        num_vip_seats: Number(num_vip_seats),
      },
    });

    req.flash("success", { msg: `Updated aircraft ${aircraft_name}` });
    res.redirect("/aircrafts");
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;

    if (!id) {
      req.flash("errors", { msg: `id is not match` });
      return res.redirect("/aircrafts");
    }

    const existingAircraft = await models.aircraft.findUnique({
      where: { aircraft_id: Number(id) },
    });

    if (!existingAircraft) {
      req.flash("errors", { msg: `Aircraft ${id} is not found.` });
      return res.redirect("/aircrafts");
    }

    await models.aircraft.delete({
      where: { aircraft_id: Number(id) },
    });

    req.flash("success", { msg: `Deleted aircraft ${id}` });
    res.redirect("/aircrafts");
  }
}
