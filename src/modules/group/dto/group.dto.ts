import { z } from 'zod';

export const createGroupSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  promotionId: z.string().cuid('Invalid promotion ID format').optional(),
});

export type CreateGroupDto = z.infer<typeof createGroupSchema>;

export const updateGroupSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  promotionId: z.string().cuid('Invalid promotion ID format').optional(),
});

export type UpdateGroupDto = z.infer<typeof updateGroupSchema>;

export const getGroupsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(), // Search by name
  promotionId: z.string().cuid('Invalid promotion ID format').optional(),
});

export type GetGroupsQueryDto = z.infer<typeof getGroupsQuerySchema>;

export const groupIdParamSchema = z.object({
  id: z.string().cuid('Invalid group ID format'),
});

export type GroupIdParamDto = z.infer<typeof groupIdParamSchema>;

export interface GroupResponseDto {
  id: string;
  name: string;
  promotionId?: string;
  createdAt: string;
  updatedAt: string;
}
