import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  objectives: z.string().min(1, 'Objectives are required'),
  deadline: z.string().datetime().optional(),
  createdById: z.string().cuid('Invalid creator ID format'),
});

export type CreateProjectDto = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().min(1, 'Description is required').optional(),
  objectives: z.string().min(1, 'Objectives are required').optional(),
  deadline: z.string().datetime().optional(),
});

export type UpdateProjectDto = z.infer<typeof updateProjectSchema>;

export const getProjectsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(), // Search by title, description, or objectives
  createdById: z.string().cuid('Invalid creator ID format').optional(),
});

export type GetProjectsQueryDto = z.infer<typeof getProjectsQuerySchema>;

export const projectIdParamSchema = z.object({
  id: z.string().cuid('Invalid project ID format'),
});

export type ProjectIdParamDto = z.infer<typeof projectIdParamSchema>;

export interface ProjectResponseDto {
  id: string;
  title: string;
  description: string;
  objectives: string;
  deadline?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}