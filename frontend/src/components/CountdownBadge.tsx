import { getCountdown } from "@/utils/date";

export default function CountdownBadge({ date }: { date?: string | null }) {
  const countdown = getCountdown(date);

  if (!countdown) {
    return (
      <span className="inline-flex items-center rounded-full bg-[var(--color-border)] px-2.5 py-1 text-xs font-medium text-[var(--color-text-muted)]">
        No date set
      </span>
    );
  }

  if (countdown.isPast) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
        Deadline Passed
      </span>
    );
  }

  const urgent = countdown.days <= 3;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
        urgent
          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
      }`}
    >
      {countdown.label}
    </span>
  );
}
