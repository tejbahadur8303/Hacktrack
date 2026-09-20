import { Request, Response } from "express";
import Reminder from "../models/Reminder";

// GET /api/reminders  (optional ?hackathonId=)
export async function getReminders(req: Request, res: Response) {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.hackathonId) filter.hackathonId = req.query.hackathonId;
    const reminders = await Reminder.find(filter)
      .populate("hackathonId", "title")
      .sort({ reminderDate: 1 });
    res.json({ success: true, data: reminders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch reminders", error: String(err) });
  }
}

// POST /api/reminders
export async function createReminder(req: Request, res: Response) {
  try {
    if (!req.body.hackathonId || !req.body.reminderDate) {
      return res.status(400).json({ success: false, message: "hackathonId and reminderDate are required" });
    }
    const reminder = await Reminder.create(req.body);
    res.status(201).json({ success: true, data: reminder });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to create reminder", error: String(err) });
  }
}

// PUT /api/reminders/:id
export async function updateReminder(req: Request, res: Response) {
  try {
    const reminder = await Reminder.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }
    res.json({ success: true, data: reminder });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to update reminder", error: String(err) });
  }
}

// DELETE /api/reminders/:id
export async function deleteReminder(req: Request, res: Response) {
  try {
    const reminder = await Reminder.findByIdAndDelete(req.params.id);
    if (!reminder) {
      return res.status(404).json({ success: false, message: "Reminder not found" });
    }
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete reminder", error: String(err) });
  }
}
