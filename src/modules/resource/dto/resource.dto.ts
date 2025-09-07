import { z } from 'zod';

export const createResourceSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  url: z.string().url('Invalid URL format'),
  projectId: z.string().cuid('Invalid project ID format'),
});

export type CreateResourceDto = z.infer<typeof createResourceSchema>;

export const updateResourceSchema = z.object({
  type: z.string().min(1, 'Type is required').optional(),
  url: z.string().url('Invalid URL format').optional(),
  projectId: z.string().cuid('Invalid project ID format').optional(),
});

export type UpdateResourceDto = z.infer<typeof updateResourceSchema>;

export const getResourcesQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(), // Search by type or url
  projectId: z.string().cuid('Invalid project ID format').optional(),
});

export type GetResourcesQueryDto = z.infer<typeof getResourcesQuerySchema>;

export const resourceIdParamSchema = z.object({
  id: z.string().cuid('Invalid resource ID format'),
});

export type ResourceIdParamDto = z.infer<typeof resourceIdParamSchema>;

export interface ResourceResponseDto {
  id: string;
  type: string;
  url: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}