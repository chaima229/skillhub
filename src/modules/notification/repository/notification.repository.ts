import { Notification, Prisma } from "@prisma/client";
import prisma from "../../../config/prisma";
import {
  CreateNotificationDto,
  UpdateNotificationDto,
  GetNotificationsQueryDto,
} from "../dto/notification.dto";

export class NotificationRepository {
  async create(data: CreateNotificationDto): Promise<Notification> {
    return prisma.notification.create({ data });
  }

  async findById(id: string): Promise<Notification | null> {
    return prisma.notification.findUnique({ where: { id } });
  }

  async findMany(query: GetNotificationsQueryDto): Promise<{
    notifications: Notification[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const page = query.page || 1;
    const limit = Math.min(query.limit || 10, 100);
    const skip = (page - 1) * limit;

    const where: Prisma.NotificationWhereInput = {};
    if (query.search) {
      where.OR = [
        { message: { contains: query.search, mode: "insensitive" } },
      ];
    }
    if (query.userId) {
      where.userId = query.userId;
    }
    if (query.read !== undefined) {
      where.read = query.read;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.notification.count({ where }),
    ]);

    return {
      notifications,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, data: UpdateNotificationDto): Promise<Notification> {
    return prisma.notification.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Notification> {
    return prisma.notification.delete({ where: { id } });
  }

  async exists(id: string): Promise<boolean> {
    const notification = await prisma.notification.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!notification;
  }
}
