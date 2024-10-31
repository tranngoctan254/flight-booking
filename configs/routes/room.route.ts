import { Router } from "express";
import { RoomController } from "../../app/controllers";
import { authenticate } from "../../app/middlewares/auth.middleware";
import { authorize } from "../../app/middlewares/role.middleware";

export class RoomRoute {
  private static path = Router();
  private static roomController = new RoomController();

  public static draw() {
    this.path.post(
      "/",
      authenticate,
      authorize(["Admin", "Manager"]),
      this.roomController.createRoom
    );

    this.path.get(
      "/",
      authenticate,
      authorize(["Admin", "Manager", "Sale"]),
      this.roomController.getAllRooms
    );

    this.path.get(
      "/search",
      authenticate,
      authorize(["Admin", "Manager", "Sale"]),
      this.roomController.searchRooms
    );

    this.path.get(
      "/:id",
      authenticate,
      authorize(["Admin", "Manager", "Sale"]),
      this.roomController.getRoomById
    );

    this.path
      .route("/:id")
      .put(
        authenticate,
        authorize(["Admin", "Manager"]),
        this.roomController.updateRoom
      )
      .delete(
        authenticate,
        authorize(["Admin"]),
        this.roomController.deleteRoom
      );

    return this.path;
  }
}
