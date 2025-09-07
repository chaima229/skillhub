import { Promotion } from "@prisma/client";
import prisma from "../../../config/prisma";
import { CreatePromotionDto, UpdatePromotionDto } from "../dto/promotion.dto";
export class PromotionRepository {
  async create(data: CreatePromotionDto): Promise<Promotion> {
    return prisma.promotion.create({ data });
  }
  async findById(id: string): Promise<Promotion | null> {
    return prisma.promotion.findUnique({ where: { id } });
  }
  async findMany(): Promise<Promotion[]> {
    return prisma.promotion.findMany();
  }
  async update(id: string, data: UpdatePromotionDto): Promise<Promotion> {
    return prisma.promotion.update({ where: { id }, data });
  }
  async delete(id: string): Promise<Promotion> {
    return prisma.promotion.delete({ where: { id } });
  }
}