import { Schema, model, Document, Types } from "mongoose";

export interface INotification extends Document {
  hackathonId?: Types.ObjectId;
  reminderId?: Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    hackathonId: { type: Schema.Types.ObjectId, ref: "Hackathon" },
    reminderId: { type: Schema.Types.ObjectId, ref: "Reminder" },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default model<INotification>("Notification", NotificationSchema);
