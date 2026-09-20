import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import { connectDB } from "./config/db";
import { startReminderJob } from "./jobs/reminderJob";

const PORT = process.env.PORT || 5050;

async function start() {
  await connectDB();

  const app = createApp();

  app.listen(PORT, () => {
    console.log(`[server] HackTrack API listening on port ${PORT}`);
  });

  startReminderJob();
}

start().catch((err) => {
  console.error("[server] failed to start:", err);
  process.exit(1);
});
