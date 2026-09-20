import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";

import hackathonRoutes from "./routes/hackathonRoutes";
import reminderRoutes from "./routes/reminderRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import notificationRoutes from "./routes/notificationRoutes";

export function createApp(): Application {
  const app = express();

  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(morgan("dev"));

  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ success: true, message: "HackTrack API is running" });
  });

  app.use("/api/hackathons", hackathonRoutes);
  app.use("/api/reminders", reminderRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/notifications", notificationRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ success: false, message: "Route not found" });
  });

  // Global error handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[error]", err);
    res.status(500).json({ success: false, message: "Internal server error", error: err.message });
  });

  return app;
}
