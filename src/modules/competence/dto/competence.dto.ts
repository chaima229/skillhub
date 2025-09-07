import { z } from 'zod';

export const createCompetenceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  level: z.string().min(1, 'Level is required'),
});

export type CreateCompetenceDto = z.infer<typeof createCompetenceSchema>;

export const updateCompetenceSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  level: z.string().min(1, 'Level is required').optional(),
});

export type UpdateCompetenceDto = z.infer<typeof updateCompetenceSchema>;

export const getCompetencesQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(), // Search by name or level
});

export type GetCompetencesQueryDto = z.infer<typeof getCompetencesQuerySchema>;

export const competenceIdParamSchema = z.object({
  id: z.string().cuid('Invalid competence ID format'),
});

export type CompetenceIdParamDto = z.infer<typeof competenceIdParamSchema>;

export interface CompetenceResponseDto {
  id: string;
  name: string;
  level: string;
  createdAt: string;
  updatedAt: string;
}