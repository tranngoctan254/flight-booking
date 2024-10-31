import { Router } from "express";
import { UserController } from "../../app/controllers";
import { authenticate } from "../../app/middlewares/auth.middleware";
import { authorize } from "../../app/middlewares/role.middleware";

export class UserRoute {
  private static path = Router();
  private static userController = new UserController();

  public static draw() {
    this.path.post("/register", this.userController.register);
    this.path.post("/login", this.userController.login);

    this.path.use(authenticate);

    this.path.get(
      "/",
      authorize(["Admin", "Manager"]),
      this.userController.getAllUsers
    );

    this.path.get(
      "/search",
      authorize(["Admin", "Manager"]),
      this.userController.searchUsers
    );

    this.path
      .route("/:id")
      .get(authorize(["Admin", "Manager"]), this.userController.getUserById)
      .put(authorize(["Admin", "Manager"]), this.userController.updateUser)
      .delete(authorize(["Admin"]), this.userController.deleteUser);

    return this.path;
  }
}
