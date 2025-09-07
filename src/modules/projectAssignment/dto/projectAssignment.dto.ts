import { z } from 'zod';

export const AssignmentStatus = z.enum(['EN_COURS', 'SOUMIS', 'VALIDE', 'A_RETRAVAILLER']);

export const createProjectAssignmentSchema = z.object({
  projectId: z.string().cuid('Invalid project ID format'),
  userId: z.string().cuid('Invalid user ID format'),
  status: AssignmentStatus.optional(),
});

export type CreateProjectAssignmentDto = z.infer<typeof createProjectAssignmentSchema>;

export const updateProjectAssignmentSchema = z.object({
  projectId: z.string().cuid('Invalid project ID format').optional(),
  userId: z.string().cuid('Invalid user ID format').optional(),
  status: AssignmentStatus.optional(),
});

export type UpdateProjectAssignmentDto = z.infer<typeof updateProjectAssignmentSchema>;

export const getProjectAssignmentsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  searchProjectId: z.string().cuid('Invalid project ID format').optional(),
  searchUserId: z.string().cuid('Invalid user ID format').optional(),
  status: AssignmentStatus.optional(),
});

export type GetProjectAssignmentsQueryDto = z.infer<typeof getProjectAssignmentsQuerySchema>;

export const projectAssignmentIdsParamSchema = z.object({
  projectId: z.string().cuid('Invalid project ID format'),
  userId: z.string().cuid('Invalid user ID format'),
});

export type ProjectAssignmentIdsParamDto = z.infer<typeof projectAssignmentIdsParamSchema>;

export interface ProjectAssignmentResponseDto {
  projectId: string;
  userId: string;
  status: z.infer<typeof AssignmentStatus>;
  createdAt: string;
  updatedAt: string;
}