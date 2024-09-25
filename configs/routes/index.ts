import { HomeController } from "@controllers";
import { Router } from "express";
import { RestActions } from "../enum";
import { AircraftRoute } from "./aircraft.route";
import { AuthRoute } from "./auth.route";
import { FlightRoute } from "./flight.route";
import { PromotionRoute } from "./promotion.route";
import { RouteRoute } from "./route.route";
import { TicketRoute } from "./ticket.route";
import { UserRoute } from "./user.route";

export class Route {
  private static path = Router();
  private static homeController = new HomeController();

  public static draw() {
    this.path.use("/auth", AuthRoute.draw());
    this.path.use("/users", UserRoute.draw());
    this.path.use("/aircrafts", AircraftRoute.draw());
    this.path.use("/flights", FlightRoute.draw());
    this.path.use("/bookings", UserRoute.draw());
    this.path.use("/tickets", TicketRoute.draw());
    this.path.use("/promotions", PromotionRoute.draw());
    this.path.use("/routes", RouteRoute.draw());

    Route.resource(this.path, this.homeController, {
      only: [RestActions.Index],
    });

    return this.path;
  }

  public static resource(
    path: Router,
    customController: any,
    filter?: {
      only?: RestActions[];
      except?: RestActions[];
    }
  ) {
    if (filter?.only && filter?.except) {
      throw new Error("Can only pass only or except!");
    }

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Index))
      path.route("/").get(customController.index);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.New))
      path.route("/new").get(customController.new);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Show))
      path.route("/:id").get(customController.show);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Create))
      path.route("/").post(customController.create);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Edit))
      path.route("/:id/edit").get(customController.edit);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Update))
      path.route("/:id").put(customController.update);

    if (this.isAllowAccess(filter?.only, filter?.except, RestActions.Destroy))
      path.route("/:id").delete(customController.destroy);
  }

  private static isAllowAccess(
    only: RestActions[] | undefined,
    except: RestActions[] | undefined,
    action: RestActions
  ) {
    return (
      (!only && !except) ||
      (only && only?.includes(action)) ||
      (except && !except?.includes(action))
    );
  }
}
