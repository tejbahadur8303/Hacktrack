export type ReminderType =
  | "Registration Deadline"
  | "Hackathon Start"
  | "Submission Deadline"
  | "Presentation Date"
  | "Custom";

export interface Reminder {
  _id: string;
  hackathonId: string | { _id: string; title: string };
  title: string;
  reminderType: ReminderType;
  reminderDate: string;
  isEnabled: boolean;
  isCompleted: boolean;
  notificationSent: boolean;
  createdAt: string;
}

export type ReminderInput = {
  hackathonId: string;
  title: string;
  reminderType: ReminderType;
  reminderDate: string;
  isEnabled?: boolean;
};

export const REMINDER_TYPES: ReminderType[] = [
  "Registration Deadline",
  "Hackathon Start",
  "Submission Deadline",
  "Presentation Date",
  "Custom",
];
