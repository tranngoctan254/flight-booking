import models from "@models/prisma";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class RouteController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const routes = await models.route.findMany();
    res.render("route.view/index", { routes });
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;
    const route = await models.route.findUnique({
      where: { route_id: Number(id) },
    });

    if (!route) {
      req.flash("errors", { msg: `Route ${id} is not found.` });
      return res.redirect("/routes");
    }

    res.render("route.view/show", { route });
  }

  public async new(req: Request, res: Response) {
    res.render("route.view/new");
  }

  public async create(req: Request, res: Response) {
    const { from_airport, to_airport, distance, duration, price } = req.body;

    await models.route.create({
      data: {
        from_airport,
        to_airport,
        distance: Number(distance),
        duration,
        price: Number(price),
      },
    });

    req.flash("success", {
      msg: `Created route from ${from_airport} to ${to_airport}`,
    });
    res.redirect("/routes");
  }

  public async edit(req: Request, res: Response) {
    const { id } = req.params;
    const route = await models.route.findUnique({
      where: { route_id: Number(id) },
    });

    if (!route) {
      req.flash("errors", { msg: `Route ${id} is not found.` });
      return res.redirect("/routes");
    }

    res.render("route.view/edit", { route });
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { from_airport, to_airport, distance, duration, price } = req.body;

    await models.route.update({
      where: { route_id: Number(id) },
      data: {
        from_airport,
        to_airport,
        distance: Number(distance),
        duration,
        price: Number(price),
      },
    });

    req.flash("success", {
      msg: `Updated route from ${from_airport} to ${to_airport}`,
    });
    res.redirect("/routes");
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;

    await models.route.delete({ where: { route_id: Number(id) } });
    req.flash("success", { msg: `Deleted route ${id}` });
    res.redirect("/routes");
  }
}
