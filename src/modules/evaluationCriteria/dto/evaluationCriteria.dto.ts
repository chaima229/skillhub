import { z } from 'zod';

export const createEvaluationCriteriaSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  weight: z.number().int().min(0, 'Weight must be a non-negative integer'),
  projectId: z.string().cuid('Invalid project ID format'),
});

export type CreateEvaluationCriteriaDto = z.infer<typeof createEvaluationCriteriaSchema>;

export const updateEvaluationCriteriaSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  weight: z.number().int().min(0, 'Weight must be a non-negative integer').optional(),
  projectId: z.string().cuid('Invalid project ID format').optional(),
});

export type UpdateEvaluationCriteriaDto = z.infer<typeof updateEvaluationCriteriaSchema>;

export const getEvaluationCriteriaQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(), // Search by name
  projectId: z.string().cuid('Invalid project ID format').optional(),
});

export type GetEvaluationCriteriaQueryDto = z.infer<typeof getEvaluationCriteriaQuerySchema>;

export const evaluationCriteriaIdParamSchema = z.object({
  id: z.string().cuid('Invalid evaluation criteria ID format'),
});

export type EvaluationCriteriaIdParamDto = z.infer<typeof evaluationCriteriaIdParamSchema>;

export interface EvaluationCriteriaResponseDto {
  id: string;
  name: string;
  weight: number;
  projectId: string;
}