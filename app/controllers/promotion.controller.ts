import models from "@models/prisma";
import { Request, Response } from "express";
import { ApplicationController } from ".";

export class PromotionController extends ApplicationController {
  public async index(req: Request, res: Response) {
    const promotions = await models.promotion.findMany();
    res.render("promotion.view/index", { promotions });
  }

  public async show(req: Request, res: Response) {
    const { id } = req.params;
    const promotion = await models.promotion.findUnique({
      where: { promotion_id: Number(id) },
    });

    if (!promotion) {
      req.flash("errors", { msg: `Promotion ${id} is not found.` });
      return res.redirect("/promotions");
    }

    res.render("promotion.view/show", { promotion });
  }

  public async new(req: Request, res: Response) {
    res.render("promotion.view/new");
  }

  public async create(req: Request, res: Response) {
    const { promotion_name, description, promotion_value } = req.body;

    await models.promotion.create({
      data: {
        promotion_name,
        description,
        promotion_value: Number(promotion_value),
      },
    });

    req.flash("success", { msg: `Created promotion ${promotion_name}` });
    res.redirect("/promotions");
  }

  public async edit(req: Request, res: Response) {
    const { id } = req.params;
    const promotion = await models.promotion.findUnique({
      where: { promotion_id: Number(id) },
    });

    if (!promotion) {
      req.flash("errors", { msg: `Promotion ${id} is not found.` });
      return res.redirect("/promotions");
    }

    res.render("promotion.view/edit", { promotion });
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { promotion_name, description, promotion_value } = req.body;

    await models.promotion.update({
      where: { promotion_id: Number(id) },
      data: {
        promotion_name,
        description,
        promotion_value: Number(promotion_value),
      },
    });

    req.flash("success", { msg: `Updated promotion ${promotion_name}` });
    res.redirect("/promotions");
  }

  public async destroy(req: Request, res: Response) {
    const { id } = req.params;

    await models.promotion.delete({ where: { promotion_id: Number(id) } });
    req.flash("success", { msg: `Deleted promotion ${id}` });
    res.redirect("/promotions");
  }
}
