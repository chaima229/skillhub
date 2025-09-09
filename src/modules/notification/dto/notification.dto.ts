import { z } from 'zod';

export const createNotificationSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  userId: z.string().cuid('Invalid user ID format'),
  read: z.boolean().optional(),
});

export type CreateNotificationDto = z.infer<typeof createNotificationSchema>;

export const updateNotificationSchema = z.object({
  message: z.string().min(1, 'Message is required').optional(),
  userId: z.string().cuid('Invalid user ID format').optional(),
  read: z.boolean().optional(),
});

export type UpdateNotificationDto = z.infer<typeof updateNotificationSchema>;

export const getNotificationsQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(), // Search by message
  userId: z.string().cuid('Invalid user ID format').optional(),
  read: z.string().transform( (val) => val === 'true' ).optional(),
});

export type GetNotificationsQueryDto = z.infer<typeof getNotificationsQuerySchema>;

export const notificationIdParamSchema = z.object({
  id: z.string().cuid('Invalid notification ID format'),
});

export type NotificationIdParamDto = z.infer<typeof notificationIdParamSchema>;

export interface NotificationResponseDto {
  id: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}