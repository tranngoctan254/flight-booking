import { Request, Response } from "express";

export class HomeController {
  public async index(req: Request, res: Response) {
    try {
      res.render("index", {
        title: "Welcome to Airline-X",
        message: "Enjoy your flight with us!",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error rendering home page");
    }
  }
}
