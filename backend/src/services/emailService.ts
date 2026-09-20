import nodemailer from "nodemailer";

/**
 * Email reminders are optional. If SMTP env vars are not set, this
 * silently no-ops so the app works fine without email configured.
 */
export async function sendReminderEmail(
  reminderTitle: string,
  hackathonTitle: string,
  reminderType: string
): Promise<void> {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, REMINDER_EMAIL_FROM, REMINDER_EMAIL_TO } =
    process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !REMINDER_EMAIL_TO) {
    return; // email not configured, skip quietly
  }

  try {
    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT) || 587,
      secure: false,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });

    await transporter.sendMail({
      from: REMINDER_EMAIL_FROM || SMTP_USER,
      to: REMINDER_EMAIL_TO,
      subject: `HackTrack Reminder: ${reminderTitle}`,
      text: `${reminderType} reminder for "${hackathonTitle}": ${reminderTitle}`,
    });
  } catch (err) {
    console.error("[emailService] failed to send reminder email:", err);
  }
}
