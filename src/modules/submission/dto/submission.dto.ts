import { z } from 'zod';

export const AssignmentStatusSchema = z.enum([
  'EN_COURS',
  'SOUMIS',
  'VALIDE',
  'A_RETRAVAILLER',
]);

export const createSubmissionSchema = z.object({
  userId: z.string().cuid('Invalid user ID format'),
  projectId: z.string().cuid('Invalid project ID format'),
  url: z.string().url('Invalid URL format').optional(),
  comments: z.string().optional(),
  grade: z.number().min(0).max(20).optional(),
});

export type CreateSubmissionDto = z.infer<typeof createSubmissionSchema>;

export const updateSubmissionSchema = z.object({
  url: z.string().url('Invalid URL format').optional(),
  comments: z.string().optional(),
  grade: z.number().min(0).max(20).optional(),
  status: AssignmentStatusSchema.optional(),
});

export type UpdateSubmissionDto = z.infer<typeof updateSubmissionSchema>;

export const getSubmissionsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(), // Search by url or comments
  userId: z.string().cuid('Invalid user ID format').optional(),
  projectId: z.string().cuid('Invalid project ID format').optional(),
  status: AssignmentStatusSchema.optional(),
});

export type GetSubmissionsQueryDto = z.infer<typeof getSubmissionsQuerySchema>;

export const submissionIdParamSchema = z.object({
  id: z.string().cuid('Invalid submission ID format'),
});

export type SubmissionIdParamDto = z.infer<typeof submissionIdParamSchema>;

export interface SubmissionResponseDto {
  id: string;
  userId: string;
  projectId: string;
  url?: string;
  comments?: string;
  grade?: number;
  status: z.infer<typeof AssignmentStatusSchema>;
  createdAt: string;
  updatedAt: string;
}