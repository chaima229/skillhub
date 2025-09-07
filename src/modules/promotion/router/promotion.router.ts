import { Router } from "express";
import { getPromotions, getPromotionById, createPromotion, updatePromotion, deletePromotion } from "../controller/promotion.controller";
const router = Router();
router.get("/", getPromotions);
router.get("/:id", getPromotionById);
router.post("/", createPromotion);
router.patch("/:id", updatePromotion);
router.delete("/:id", deletePromotion);
export default router;