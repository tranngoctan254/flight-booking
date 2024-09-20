import { models } from "@models/prisma";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class DevController extends ApplicationController {
  public async index(req: Request, res: Response) {
    console.log(req.session);
    res.render("home.view/index", { title: "Irwin Framework" });
  }

  public async show(req: Request, res: Response) {
    if (isNaN(+req.params.id)) {
      req.flash("errors", { msg: `${req.params.id} is not a valid ID.` });
      return res.redirect("/");
    }

    try {
      const user = await models.user.findUnique({
        where: {
          user_id: +req.params.id,
        },
        include: {},
      });

      if (user) {
        req.session.userId = user.user_id;
        req.flash("success", { msg: `Found user: ${user.username}.` });
      } else {
        req.flash("errors", {
          msg: `User with ID: ${req.params.id} not found.`,
        });
      }

      res.redirect("/");
    } catch (error) {
      console.error(error);
      req.flash("errors", {
        msg: "An error occurred while fetching the user.",
      });
      res.redirect("/");
    }
  }

  public async new(req: Request, res: Response) {
    res.render("dev.view/new");
  }

  public async update(req: Request, res: Response) {}

  public async destroy(req: Request, res: Response) {}
}
