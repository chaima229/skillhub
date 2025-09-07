import { Request, Response, NextFunction } from "express";
import { PromotionService } from "../service/promotion.service";
import { createPromotionSchema, updatePromotionSchema } from "../dto/promotion.dto";
const service = new PromotionService();
export async function getPromotions(req: Request, res: Response, next: NextFunction) {
  try { res.json(await service.getPromotions()); } catch (e) { next(e); }
}
export async function getPromotionById(req: Request, res: Response, next: NextFunction) {
  try { res.json(await service.getPromotionById(req.params.id)); } catch (e) { next(e); }
}
export async function createPromotion(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createPromotionSchema.parse(req.body);
    res.status(201).json(await service.createPromotion(data));
  } catch (e) { next(e); }
}
export async function updatePromotion(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updatePromotionSchema.parse(req.body);
    res.json(await service.updatePromotion(req.params.id, data));
  } catch (e) { next(e); }
}
export async function deletePromotion(req: Request, res: Response, next: NextFunction) {
  try { await service.deletePromotion(req.params.id); res.status(204).send(); } catch (e) { next(e); }
}