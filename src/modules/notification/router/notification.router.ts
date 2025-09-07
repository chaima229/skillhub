import { Router } from "express";
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../controller/notification.controller";

const router = Router();

router.get("/", getNotifications);
router.get("/:id", getNotificationById);
router.post("/", createNotification);
router.patch("/:id", updateNotification);
router.delete("/:id", deleteNotification);

export default router;
