import { Request, Response, NextFunction } from "express";
import { NotificationService } from "../service/notification.service";
import {
  createNotificationSchema,
  updateNotificationSchema,
  getNotificationsQuerySchema,
  notificationIdParamSchema,
} from "../dto/notification.dto";

const notificationService = new NotificationService();

export async function getNotifications(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = getNotificationsQuerySchema.parse(req.query);
    const result = await notificationService.getNotifications(query);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getNotificationById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = notificationIdParamSchema.parse(req.params);
    const notification = await notificationService.getNotificationById(id);
    res.json(notification);
  } catch (error) {
    next(error);
  }
}

export async function createNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const data = createNotificationSchema.parse(req.body);
    const notification = await notificationService.createNotification(data);
    res.status(201).json(notification);
  } catch (error) {
    next(error);
  }
}

export async function updateNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = notificationIdParamSchema.parse(req.params);
    const data = updateNotificationSchema.parse(req.body);
    const notification = await notificationService.updateNotification(id, data);
    res.json(notification);
  } catch (error) {
    next(error);
  }
}

export async function deleteNotification(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = notificationIdParamSchema.parse(req.params);
    await notificationService.deleteNotification(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
