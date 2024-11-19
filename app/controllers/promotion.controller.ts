import { Request, Response } from "express";
import PromotionService from "../services/promotion.service";

export default new (class PromotionController {
  // Tạo mới khuyến mãi
  async createPromotion(req: Request, res: Response) {
    try {
      const { promoID, name, description, value } = req.body;

      // Kiểm tra các thông tin hợp lệ
      if (!promoID || !name || !description || value <= 0) {
        return res.status(400).json({ message: "Invalid promotion data." });
      }

      const promotion = await PromotionService.createPromotion({
        promoID, // Đảm bảo gửi promoID
        name,
        description,
        value,
      });

      res.status(201).json({
        message: "Promotion created successfully",
        promotion,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Lấy tất cả các khuyến mãi
  async getAllPromotions(req: Request, res: Response) {
    try {
      const promotions = await PromotionService.getAllPromotions();
      res.status(200).json({ promotions });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Lấy khuyến mãi theo ID
  async getPromotionById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid promotion ID" });
      }

      const promotion = await PromotionService.getPromotionById(id);

      if (!promotion) {
        return res.status(404).json({ message: "Promotion not found" });
      }

      res.status(200).json({ promotion });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Cập nhật khuyến mãi
  async updatePromotion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, description, value } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid promotion ID" });
      }

      const updatedPromotion = await PromotionService.updatePromotion(id, {
        name,
        description,
        value,
      });

      res.status(200).json({
        message: "Promotion updated successfully",
        promotion: updatedPromotion,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  // Xóa khuyến mãi
  async deletePromotion(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid promotion ID" });
      }

      const deletedPromotion = await PromotionService.deletePromotion(id);

      res.status(200).json({
        message: "Promotion deleted successfully",
        promotion: deletedPromotion,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
})();
