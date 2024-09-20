import env from "@configs/env";
import { models } from "@models/prisma";
import axios from "axios";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class AuthController extends ApplicationController {
  public async loginWithGoogle(req: Request, res: Response) {
    res.redirect(
      `https://accounts.google.com/o/oauth2/v2/auth?client_id=${env.googleClientId}&redirect_uri=${env.googleRedirectUri}&response_type=code&scope=profile email`
    );
  }

  public async loginWithGoogleRedirect(req: Request, res: Response) {
    const { code } = req.query;

    const {
      data: { access_token },
    } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: env.googleClientId,
      client_secret: env.googleClientSecret,
      code,
      redirect_uri: env.googleRedirectUri,
      grant_type: "authorization_code",
    });

    const { data: googleUser } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const loginUser = await models.user.findFirst({
      where: {
        email: googleUser.email,
      },
    });

    if (!loginUser) {
      // Create new user
      const newUser = await models.user.create({
        data: {
          username: googleUser.name,
          email: googleUser.email,
          avatarUrl: googleUser.picture,
          role: "user",
          password: "",
        },
      });

      req.session.userId = newUser.user_id;
    } else {
      await models.user.update({
        where: {
          user_id: loginUser.user_id,
        },
        data: {
          username: googleUser.name,
          email: googleUser.email,
          avatarUrl: googleUser.picture,
        },
      });

      req.session.userId = loginUser.user_id;
    }

    req.flash("success", { msg: "Login successfully" });
    res.redirect("/");
  }

  public async index(req: Request, res: Response) {
    res.render("auth.view/index");
  }

  public async create(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await models.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (user) {
      req.session.userId = user.user_id;
      req.flash("success", { msg: "Login successfully" });
    } else {
      req.flash("errors", { msg: "User not found or incorrect password." });
    }

    res.redirect("/");
  }

  public async destroy(req: Request, res: Response) {
    req.session.destroy((err: Error) => {
      if (err) {
        console.log(err);
        res.redirect("/");
      } else {
        res.redirect("https://accounts.google.com/logout");
      }
    });
  }
}
