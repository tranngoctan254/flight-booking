import { models } from "@models/prisma";
import { NextFunction, Request, Response } from "express";

export class ApplicationController {
  public async validateUserLogin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // TODO: Delete this line
    req.session.userId = 1;

    if (!req.session.userId) {
      req.flash("errors", { msg: "You have to login first." });
      return res.redirect("/");
    }

    const user = await models.user.findUnique({
      where: { user_id: req.session.userId },
    });

    if (!user) {
      req.flash("errors", {
        msg: `User with id: ${req.session.userId} does not exist.`,
      });
      return res.redirect("/");
    }

    req.user = user;
    next();
  }

  public async validateAdmin(req: Request, res: Response, next: NextFunction) {
    const currentUser = req.user;

    if (currentUser.role === "admin") {
      next();
    } else {
      req.flash("errors", {
        msg: `You are not an admin`,
      });

      return res.redirect("/");
    }
  }
}
