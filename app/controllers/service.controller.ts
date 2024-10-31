import { Request, Response } from "express";
import ServiceService from "../services/service.service";

export class ServiceController {
  async createService(req: Request, res: Response) {
    try {
      const { serviceID, name, description, unit, price } = req.body;

      if (!serviceID || !name || !description || !unit || !price) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const service = await ServiceService.createService({
        serviceID,
        name,
        description,
        unit,
        price,
      });

      res.status(201).json({
        message: "Service created successfully",
        service,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "ServiceID already exists" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getAllServices(req: Request, res: Response) {
    try {
      const services = await ServiceService.getAllServices();
      res.status(200).json({ services });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getServiceById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }

      const service = await ServiceService.getServiceById(id);

      if (!service) {
        return res.status(404).json({ message: "Service not found" });
      }

      res.status(200).json({ service });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async searchServices(req: Request, res: Response) {
    try {
      const { query } = req.query;

      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Query parameter is required" });
      }

      const services = await ServiceService.searchServices(query);
      res.status(200).json({ services });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async updateService(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { serviceID, name, description, unit, price } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }

      const updatedService = await ServiceService.updateService(id, {
        serviceID,
        name,
        description,
        unit,
        price,
      });

      res.status(200).json({
        message: "Service updated successfully",
        service: updatedService,
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "ServiceID already exists" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async deleteService(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid service ID" });
      }

      const deletedService = await ServiceService.deleteService(id);

      res.status(200).json({
        message: "Service deleted successfully",
        service: deletedService,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
