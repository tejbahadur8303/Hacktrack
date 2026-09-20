import { Request, Response } from "express";
import Notification from "../models/Notification";

// GET /api/notifications
export async function getNotifications(req: Request, res: Response) {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: notifications });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch notifications", error: String(err) });
  }
}

// PUT /api/notifications/:id/read
export async function markNotificationRead(req: Request, res: Response) {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }
    res.json({ success: true, data: notification });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update notification", error: String(err) });
  }
}
