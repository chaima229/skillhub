import { z } from "zod";
export const createPromotionSchema = z.object({
  name: z.string().min(1, "Name is required"),
});
export type CreatePromotionDto = z.infer<typeof createPromotionSchema>;
export const updatePromotionSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
});
export type UpdatePromotionDto = z.infer<typeof updatePromotionSchema>;
