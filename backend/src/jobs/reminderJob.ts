import cron from "node-cron";
import Reminder from "../models/Reminder";
import Notification from "../models/Notification";
import { sendReminderEmail } from "../services/emailService";

/**
 * Runs every minute. Finds enabled, not-yet-sent reminders whose reminderDate
 * has arrived, creates an in-app notification, optionally emails, and marks
 * notificationSent to avoid duplicate delivery.
 */
export function startReminderJob(): void {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const dueReminders = await Reminder.find({
        isEnabled: true,
        isCompleted: false,
        notificationSent: false,
        reminderDate: { $lte: now },
      }).populate("hackathonId", "title");

      for (const reminder of dueReminders) {
        const hackathonTitle =
          (reminder.hackathonId as unknown as { title?: string })?.title || "your hackathon";

        await Notification.create({
          hackathonId: reminder.hackathonId,
          reminderId: reminder._id,
          message: `Reminder: ${reminder.title} (${reminder.reminderType}) for "${hackathonTitle}"`,
        });

        await sendReminderEmail(reminder.title, hackathonTitle, reminder.reminderType);

        reminder.notificationSent = true;
        await reminder.save();
      }

      if (dueReminders.length > 0) {
        console.log(`[reminderJob] delivered ${dueReminders.length} reminder(s) at ${now.toISOString()}`);
      }
    } catch (err) {
      console.error("[reminderJob] error:", err);
    }
  });

  console.log("[reminderJob] scheduled (runs every minute)");
}
