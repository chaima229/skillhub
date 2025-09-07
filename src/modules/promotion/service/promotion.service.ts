import { PromotionRepository } from "../repository/promotion.repository";
import { CreatePromotionDto, UpdatePromotionDto } from "../dto/promotion.dto";
export class PromotionService {
  private repo = new PromotionRepository();
  async createPromotion(data: CreatePromotionDto) {
    return this.repo.create(data);
  }
  async getPromotions() {
    return this.repo.findMany();
  }
  async getPromotionById(id: string) {
    return this.repo.findById(id);
  }
  async updatePromotion(id: string, data: UpdatePromotionDto) {
    return this.repo.update(id, data);
  }
  async deletePromotion(id: string) {
    return this.repo.delete(id);
  }
}