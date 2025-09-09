import { Notification } from "@prisma/client";
import { NotificationRepository } from "../repository/notification.repository";
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  GetNotificationsQueryDto,
  NotificationResponseDto,
} from "../dto/notification.dto";
import {
  NotFoundError,
} from "../../../utils/error-handler";

export class NotificationService {
  private notificationRepository: NotificationRepository;

  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  async createNotification(data: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.create(data);
    return this.mapToResponseDto(notification);
  }

  async getNotifications(query: GetNotificationsQueryDto): Promise<{
    notifications: NotificationResponseDto[];
    meta: { total: number; page: number; limit: number; totalPages: number };
  }> {
    const result = await this.notificationRepository.findMany(query);
    return {
      notifications: result.notifications.map((n) => this.mapToResponseDto(n)),
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  }

  async getNotificationById(id: string): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }
    return this.mapToResponseDto(notification);
  }

  async updateNotification(
    id: string,
    updateData: UpdateNotificationDto
  ): Promise<NotificationResponseDto> {
    const existingNotification = await this.notificationRepository.findById(id);
    if (!existingNotification) {
      throw new NotFoundError("Notification not found");
    }

    const updatedNotification = await this.notificationRepository.update(id, updateData);
    return this.mapToResponseDto(updatedNotification);
  }

  async deleteNotification(id: string): Promise<void> {
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }
    await this.notificationRepository.delete(id);
  }

  private mapToResponseDto(notification: Notification): NotificationResponseDto {
    return {
      id: notification.id,
      message: notification.message,
      userId: notification.userId,
      read: notification.read,
      createdAt: notification.createdAt.toISOString(),
    };
  }
}
