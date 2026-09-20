import type { HackathonStatus } from "@/types/hackathon";

const STYLES: Record<HackathonStatus, string> = {
  Interested: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  Registered: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "In Progress": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  Submitted: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Cancelled: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function StatusBadge({ status }: { status: HackathonStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STYLES[status]}`}>
      {status}
    </span>
  );
}
