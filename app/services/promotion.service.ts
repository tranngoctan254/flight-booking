import { Promotion } from "@prisma/client";
import prisma from "../../models/prisma";

class PromotionService {
  async createPromotion(data: {
    promoID: string;
    name: string;
    description: string;
    value: number;
  }): Promise<Promotion> {
    if (!data.promoID || !data.name || !data.description || data.value <= 0) {
      throw new Error("Invalid promotion data.");
    }

    return await prisma.promotion.create({
      data: {
        promoID: data.promoID, // Sử dụng promoID
        name: data.name,
        description: data.description,
        value: data.value,
      },
    });
  }

  async getAllPromotions(): Promise<Promotion[]> {
    return await prisma.promotion.findMany();
  }

  async getPromotionById(id: number): Promise<Promotion | null> {
    return await prisma.promotion.findUnique({
      where: { id },
    });
  }

  async updatePromotion(
    id: number,
    data: {
      name?: string;
      description?: string;
      value?: number;
    }
  ): Promise<Promotion> {
    const existingPromotion = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!existingPromotion) {
      throw new Error("Promotion not found.");
    }

    return await prisma.promotion.update({
      where: { id },
      data,
    });
  }

  async deletePromotion(id: number): Promise<Promotion> {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new Error("Promotion not found.");
    }

    return await prisma.promotion.delete({
      where: { id },
    });
  }
}

export default new PromotionService();
