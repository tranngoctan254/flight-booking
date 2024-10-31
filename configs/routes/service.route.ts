// src/routes/serviceRoutes.ts

import { Router } from "express";
import { ServiceController } from "../../app/controllers/service.controller";
import { authenticate } from "../../app/middlewares/auth.middleware";
import { authorize } from "../../app/middlewares/role.middleware";

export class ServiceRoute {
  private static path = Router();
  private static serviceController = new ServiceController();

  public static draw() {
    this.path.post(
      "/",
      authenticate,
      authorize(["Admin", "Manager"]),
      this.serviceController.createService
    );

    this.path.get(
      "/",
      authenticate,
      authorize(["Admin", "Manager", "Sale"]),
      this.serviceController.getAllServices
    );

    this.path.get(
      "/search",
      authenticate,
      authorize(["Admin", "Manager", "Sale"]),
      this.serviceController.searchServices
    );

    this.path.get(
      "/:id",
      authenticate,
      authorize(["Admin", "Manager", "Sale"]),
      this.serviceController.getServiceById
    );

    this.path
      .route("/:id")
      .put(
        authenticate,
        authorize(["Admin", "Manager"]),
        this.serviceController.updateService
      )
      .delete(
        authenticate,
        authorize(["Admin"]),
        this.serviceController.deleteService
      );

    return this.path;
  }
}

export default ServiceRoute;
