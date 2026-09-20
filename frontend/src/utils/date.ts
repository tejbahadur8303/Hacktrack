/**
 * Timezone-aware-enough date helpers. All comparisons use the browser's
 * local timezone consistently so "days remaining" always matches what the
 * user sees on their own clock.
 */

export function formatDate(value?: string | Date | null): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(value?: string | Date | null): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export interface Countdown {
  days: number;
  isPast: boolean;
  label: string;
}

export function getCountdown(value?: string | Date | null): Countdown | null {
  if (!value) return null;
  const target = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(target.getTime())) return null;

  const now = new Date();
  const startOfNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffMs = startOfTarget.getTime() - startOfNow.getTime();
  const days = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (days < 0) {
    return { days, isPast: true, label: "Deadline Passed" };
  }
  if (days === 0) {
    return { days, isPast: false, label: "Today" };
  }
  if (days === 1) {
    return { days, isPast: false, label: "1 Day Remaining" };
  }
  return { days, isPast: false, label: `${days} Days Remaining` };
}

export type DeadlineBucket = "Today" | "Tomorrow" | "This Week" | "Next Week" | "Later" | "Passed";

export function bucketForDate(value?: string | Date | null): DeadlineBucket {
  const c = getCountdown(value);
  if (!c) return "Later";
  if (c.isPast) return "Passed";
  if (c.days === 0) return "Today";
  if (c.days === 1) return "Tomorrow";
  if (c.days <= 7) return "This Week";
  if (c.days <= 14) return "Next Week";
  return "Later";
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
