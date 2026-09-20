import { Schema, model, Document, Types } from "mongoose";

export type ReminderType =
  | "Registration Deadline"
  | "Hackathon Start"
  | "Submission Deadline"
  | "Presentation Date"
  | "Custom";

export interface IReminder extends Document {
  hackathonId: Types.ObjectId;
  title: string;
  reminderType: ReminderType;
  reminderDate: Date;
  isEnabled: boolean;
  isCompleted: boolean;
  notificationSent: boolean;
  createdAt: Date;
}

const ReminderSchema = new Schema<IReminder>(
  {
    hackathonId: { type: Schema.Types.ObjectId, ref: "Hackathon", required: true },
    title: { type: String, required: true, trim: true },
    reminderType: {
      type: String,
      enum: [
        "Registration Deadline",
        "Hackathon Start",
        "Submission Deadline",
        "Presentation Date",
        "Custom",
      ],
      default: "Custom",
    },
    reminderDate: { type: Date, required: true },
    isEnabled: { type: Boolean, default: true },
    isCompleted: { type: Boolean, default: false },
    notificationSent: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ReminderSchema.index({ reminderDate: 1, isEnabled: 1, notificationSent: 1 });

export default model<IReminder>("Reminder", ReminderSchema);
