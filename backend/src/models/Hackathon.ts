import { Schema, model, Document, Types } from "mongoose";

export type HackathonMode = "Online" | "Offline" | "Hybrid";

export type HackathonStatus =
  | "Interested"
  | "Registered"
  | "In Progress"
  | "Submitted"
  | "Completed"
  | "Cancelled";

export interface IHackathon extends Document {
  title: string;
  organizer?: string;
  websiteUrl?: string;
  registrationDate?: Date;
  registrationDeadline?: Date;
  startDate?: Date;
  endDate?: Date;
  submissionDeadline?: Date;
  resultDate?: Date;
  mode: HackathonMode;
  location?: string;
  domain?: string;
  teamName?: string;
  teamMembers?: string[];
  description?: string;
  notes?: string;
  status: HackathonStatus;
  problemStatementUrl?: string;
  githubRepoUrl?: string;
  submissionUrl?: string;
  technologiesUsed?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HackathonSchema = new Schema<IHackathon>(
  {
    title: { type: String, required: true, trim: true },
    organizer: { type: String, trim: true },
    websiteUrl: { type: String, trim: true },
    registrationDate: { type: Date },
    registrationDeadline: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    submissionDeadline: { type: Date },
    resultDate: { type: Date },
    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online",
    },
    location: { type: String, trim: true },
    domain: { type: String, trim: true },
    teamName: { type: String, trim: true },
    teamMembers: [{ type: String, trim: true }],
    description: { type: String },
    notes: { type: String },
    status: {
      type: String,
      enum: [
        "Interested",
        "Registered",
        "In Progress",
        "Submitted",
        "Completed",
        "Cancelled",
      ],
      default: "Interested",
    },
    problemStatementUrl: { type: String, trim: true },
    githubRepoUrl: { type: String, trim: true },
    submissionUrl: { type: String, trim: true },
    technologiesUsed: [{ type: String, trim: true }],
  },
  { timestamps: true }
);

HackathonSchema.index({ title: "text", organizer: "text", domain: "text" });

export default model<IHackathon>("Hackathon", HackathonSchema);
export type HackathonId = Types.ObjectId;
