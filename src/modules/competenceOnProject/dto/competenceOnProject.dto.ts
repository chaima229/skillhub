import { z } from 'zod';

export const createCompetenceOnProjectSchema = z.object({
  projectId: z.string().cuid('Invalid project ID format'),
  competenceId: z.string().cuid('Invalid competence ID format'),
});

export type CreateCompetenceOnProjectDto = z.infer<typeof createCompetenceOnProjectSchema>;

export const updateCompetenceOnProjectSchema = z.object({
  projectId: z.string().cuid('Invalid project ID format').optional(),
  competenceId: z.string().cuid('Invalid competence ID format').optional(),
});

export type UpdateCompetenceOnProjectDto = z.infer<typeof updateCompetenceOnProjectSchema>;

export const getCompetenceOnProjectsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  searchProjectId: z.string().cuid('Invalid project ID format').optional(),
  searchCompetenceId: z.string().cuid('Invalid competence ID format').optional(),
});

export type GetCompetenceOnProjectsQueryDto = z.infer<typeof getCompetenceOnProjectsQuerySchema>;

export const competenceOnProjectIdsParamSchema = z.object({
  projectId: z.string().cuid('Invalid project ID format'),
  competenceId: z.string().cuid('Invalid competence ID format'),
});

export type CompetenceOnProjectIdsParamDto = z.infer<typeof competenceOnProjectIdsParamSchema>;

export interface CompetenceOnProjectResponseDto {
  projectId: string;
  competenceId: string;
}