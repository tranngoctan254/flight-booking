import { getAccessToken, sendMail } from "@configs/mail";
import { models } from "@models/prisma";
import { Role } from "@prisma/client";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class UserController extends ApplicationController {
  public async index(req: Request, res: Response) {
    res.render("user.view/index", { user: req.user });
  }

  public async new(req: Request, res: Response) {
    res.render("user.view/new", { user: req.user });
  }

  public async create(req: Request, res: Response) {
    const { confirmPassword, password, name, avatarUrl, email } = req.body;

    if (confirmPassword !== password) {
      req.flash("errors", { msg: "Confirm password does not match." });
      return res.redirect("/users");
    }

    try {
      const user = await models.user.create({
        data: {
          username: name,
          avatarUrl,
          email,
          password,
          role: Role.user,
        },
      });

      const accessToken = await getAccessToken();

      if (!accessToken) {
        req.flash("errors", { msg: "Google token has expired." });
        return res.redirect("/users");
      }

      sendMail(
        {
          to: user.email,
          subject: "User Created",
          text: `You have been created as user ${user.username}.`,
        },
        {
          req,
          res,
        },
        accessToken.token as string
      );

      req.flash("success", {
        msg: `User ${user.username} created successfully.`,
      });
      res.redirect("/users");
    } catch (error) {
      console.error(error);
      req.flash("errors", {
        msg: "An error occurred while creating the user.",
      });
      res.redirect("/users");
    }
  }
}
