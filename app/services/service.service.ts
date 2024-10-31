import { Service } from "@prisma/client";
import { models } from "../../models/prisma";

class ServiceService {
  async createService(data: {
    serviceID: string;
    name: string;
    description: string;
    unit: string;
    price: number;
  }): Promise<Service> {
    return await models.service.create({
      data: {
        serviceID: data.serviceID,
        name: data.name,
        description: data.description,
        unit: data.unit,
        price: data.price,
      },
    });
  }

  async getAllServices(): Promise<Service[]> {
    return await models.service.findMany();
  }

  async getServiceById(id: number): Promise<Service | null> {
    return await models.service.findUnique({
      where: { id },
    });
  }

  async searchServices(query: string): Promise<Service[]> {
    return await models.service.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { description: { contains: query } },
          { serviceID: { contains: query } },
        ],
      },
    });
  }

  async updateService(
    id: number,
    data: {
      serviceID?: string;
      name?: string;
      description?: string;
      unit?: string;
      price?: number;
    }
  ): Promise<Service> {
    const updateData: any = {};

    if (data.serviceID) updateData.serviceID = data.serviceID;
    if (data.name) updateData.name = data.name;
    if (data.description) updateData.description = data.description;
    if (data.unit) updateData.unit = data.unit;
    if (data.price) updateData.price = data.price;

    return await models.service.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteService(id: number): Promise<Service> {
    return await models.service.delete({
      where: { id },
    });
  }
}

export default new ServiceService();
