import { Request, Response } from "express";
import Hackathon from "../models/Hackathon";
import Reminder from "../models/Reminder";

// GET /api/hackathons  (supports search, filter, sort via query params)
export async function getHackathons(req: Request, res: Response) {
  try {
    const { search, status, mode, domain, sortBy, order } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    if (mode) filter.mode = mode;
    if (domain) filter.domain = domain;
    if (search) {
      filter.title = { $regex: String(search), $options: "i" };
    }

    const sortField = typeof sortBy === "string" ? sortBy : "startDate";
    const sortOrder = order === "desc" ? -1 : 1;

    const hackathons = await Hackathon.find(filter).sort({
      [sortField]: sortOrder,
    });

    res.json({ success: true, data: hackathons });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch hackathons", error: String(err) });
  }
}

// GET /api/hackathons/:id
export async function getHackathonById(req: Request, res: Response) {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: "Hackathon not found" });
    }
    const reminders = await Reminder.find({ hackathonId: hackathon._id });
    res.json({ success: true, data: { ...hackathon.toObject(), reminders } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch hackathon", error: String(err) });
  }
}

// POST /api/hackathons
export async function createHackathon(req: Request, res: Response) {
  try {
    if (!req.body.title || !String(req.body.title).trim()) {
      return res.status(400).json({ success: false, message: "Hackathon name is required" });
    }
    const hackathon = await Hackathon.create(req.body);
    res.status(201).json({ success: true, data: hackathon });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to create hackathon", error: String(err) });
  }
}

// PUT /api/hackathons/:id
export async function updateHackathon(req: Request, res: Response) {
  try {
    const hackathon = await Hackathon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hackathon) {
      return res.status(404).json({ success: false, message: "Hackathon not found" });
    }
    res.json({ success: true, data: hackathon });
  } catch (err) {
    res.status(400).json({ success: false, message: "Failed to update hackathon", error: String(err) });
  }
}

// DELETE /api/hackathons/:id
export async function deleteHackathon(req: Request, res: Response) {
  try {
    const hackathon = await Hackathon.findByIdAndDelete(req.params.id);
    if (!hackathon) {
      return res.status(404).json({ success: false, message: "Hackathon not found" });
    }
    await Reminder.deleteMany({ hackathonId: hackathon._id });
    res.json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to delete hackathon", error: String(err) });
  }
}
