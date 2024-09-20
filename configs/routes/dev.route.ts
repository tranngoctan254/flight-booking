import { DevController } from "@controllers";
import { Router } from "express";

export class DevRoute {
  private static path = Router();
  private static devController = new DevController();
}
