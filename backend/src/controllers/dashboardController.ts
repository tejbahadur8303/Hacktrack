import { Request, Response } from "express";
import Hackathon from "../models/Hackathon";

// GET /api/dashboard/stats
export async function getDashboardStats(req: Request, res: Response) {
  try {
    const now = new Date();
    const all = await Hackathon.find();

    const total = all.length;
    const registered = all.filter((h) => h.status === "Registered").length;
    const upcoming = all.filter((h) => h.startDate && h.startDate > now).length;
    const completed = all.filter((h) => h.status === "Completed").length;
    const cancelled = all.filter((h) => h.status === "Cancelled").length;
    const pendingSubmissions = all.filter(
      (h) =>
        h.submissionDeadline &&
        h.submissionDeadline > now &&
        h.status !== "Submitted" &&
        h.status !== "Completed" &&
        h.status !== "Cancelled"
    ).length;

    const upcomingHackathons = all
      .filter((h) => h.startDate && h.startDate > now)
      .sort((a, b) => (a.startDate! > b.startDate! ? 1 : -1))
      .slice(0, 5);

    // Next event = nearest future startDate
    const nextEvent = upcomingHackathons[0] || null;

    // Nearest deadline across registration/submission deadlines
    const deadlineCandidates: { hackathon: string; type: string; date: Date }[] = [];
    all.forEach((h) => {
      if (h.registrationDeadline && h.registrationDeadline > now) {
        deadlineCandidates.push({ hackathon: h.title, type: "Registration Deadline", date: h.registrationDeadline });
      }
      if (h.submissionDeadline && h.submissionDeadline > now) {
        deadlineCandidates.push({ hackathon: h.title, type: "Submission Deadline", date: h.submissionDeadline });
      }
    });
    deadlineCandidates.sort((a, b) => a.date.getTime() - b.date.getTime());
    const nearestDeadline = deadlineCandidates[0] || null;

    // by domain / by status breakdowns
    const byDomain: Record<string, number> = {};
    const byStatus: Record<string, number> = {};
    all.forEach((h) => {
      const domain = h.domain || "Unspecified";
      byDomain[domain] = (byDomain[domain] || 0) + 1;
      byStatus[h.status] = (byStatus[h.status] || 0) + 1;
    });

    // Monthly participation trend (by startDate month, last 12 months window)
    const monthly: Record<string, number> = {};
    all.forEach((h) => {
      if (!h.startDate) return;
      const key = `${h.startDate.getFullYear()}-${String(h.startDate.getMonth() + 1).padStart(2, "0")}`;
      monthly[key] = (monthly[key] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        today: now,
        cards: {
          totalHackathons: total,
          registered,
          upcomingEvents: upcoming,
          pendingSubmissions,
        },
        summary: {
          total,
          registered,
          upcoming,
          completed,
          cancelled,
        },
        nextEvent,
        nearestDeadline,
        upcomingHackathons,
        byDomain,
        byStatus,
        monthlyTrend: monthly,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to compute dashboard stats", error: String(err) });
  }
}
