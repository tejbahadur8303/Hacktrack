export type HackathonMode = "Online" | "Offline" | "Hybrid";

export type HackathonStatus =
  | "Interested"
  | "Registered"
  | "In Progress"
  | "Submitted"
  | "Completed"
  | "Cancelled";

export interface Hackathon {
  _id: string;
  title: string;
  organizer?: string;
  websiteUrl?: string;
  registrationDate?: string;
  registrationDeadline?: string;
  startDate?: string;
  endDate?: string;
  submissionDeadline?: string;
  resultDate?: string;
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
  createdAt: string;
  updatedAt: string;
}

export type HackathonInput = Omit<Hackathon, "_id" | "createdAt" | "updatedAt">;

export const HACKATHON_STATUSES: HackathonStatus[] = [
  "Interested",
  "Registered",
  "In Progress",
  "Submitted",
  "Completed",
  "Cancelled",
];

export const HACKATHON_MODES: HackathonMode[] = ["Online", "Offline", "Hybrid"];

export const HACKATHON_DOMAINS = [
  "AI/ML",
  "Web3",
  "FinTech",
  "Healthcare",
  "EdTech",
  "Sustainability",
  "IoT",
  "Cybersecurity",
  "Open Innovation",
  "Other",
];
