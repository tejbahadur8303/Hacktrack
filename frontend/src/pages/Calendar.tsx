import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import { useHackathonStore } from "@/store/hackathonStore";
import { useReminderStore } from "@/store/reminderStore";
import { isSameDay, isSameMonth } from "@/utils/date";

interface CalEvent {
  hackathonId: string;
  hackathonTitle: string;
  type: "Registration Deadline" | "Hackathon Start" | "Hackathon End" | "Submission Deadline" | "Reminder";
  date: Date;
}

const TYPE_DOT: Record<CalEvent["type"], string> = {
  "Registration Deadline": "bg-amber-500",
  "Hackathon Start": "bg-emerald-500",
  "Hackathon End": "bg-slate-400",
  "Submission Deadline": "bg-purple-500",
  Reminder: "bg-[var(--color-primary)]",
};

export default function Calendar() {
  const { hackathons, isLoading, fetchAll, hasLoaded } = useHackathonStore();
  const { reminders, fetchAll: fetchReminders } = useReminderStore();
  const [cursor, setCursor] = useState(() => new Date());
  const [filterHackathonId, setFilterHackathonId] = useState("");

  useEffect(() => {
    if (!hasLoaded) fetchAll();
    fetchReminders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const events = useMemo(() => {
    const list: CalEvent[] = [];
    hackathons.forEach((h) => {
      if (filterHackathonId && h._id !== filterHackathonId) return;
      if (h.registrationDeadline) list.push({ hackathonId: h._id, hackathonTitle: h.title, type: "Registration Deadline", date: new Date(h.registrationDeadline) });
      if (h.startDate) list.push({ hackathonId: h._id, hackathonTitle: h.title, type: "Hackathon Start", date: new Date(h.startDate) });
      if (h.endDate) list.push({ hackathonId: h._id, hackathonTitle: h.title, type: "Hackathon End", date: new Date(h.endDate) });
      if (h.submissionDeadline) list.push({ hackathonId: h._id, hackathonTitle: h.title, type: "Submission Deadline", date: new Date(h.submissionDeadline) });
    });
    reminders.forEach((r) => {
      const hackathonId = typeof r.hackathonId === "object" ? r.hackathonId._id : r.hackathonId;
      const hackathonTitle = typeof r.hackathonId === "object" ? r.hackathonId.title : "";
      if (filterHackathonId && hackathonId !== filterHackathonId) return;
      list.push({ hackathonId, hackathonTitle, type: "Reminder", date: new Date(r.reminderDate) });
    });
    return list;
  }, [hackathons, reminders, filterHackathonId]);

  const monthLabel = cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" });

  const gridDays = useMemo(() => {
    const firstOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startWeekday = firstOfMonth.getDay();
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(gridStart.getDate() - startWeekday);

    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });
  }, [cursor]);

  const today = new Date();

  if (isLoading && !hasLoaded) return <LoadingState label="Loading calendar…" />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendar</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Event dates, deadlines, and reminders at a glance.</p>
        </div>
        <select
          value={filterHackathonId}
          onChange={(e) => setFilterHackathonId(e.target.value)}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
        >
          <option value="">All hackathons</option>
          {hackathons.map((h) => <option key={h._id} value={h._id}>{h.title}</option>)}
        </select>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))} className="rounded-lg border border-[var(--color-border)] p-2 hover:bg-[var(--color-bg)]" aria-label="Previous month">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-base font-semibold">{monthLabel}</h2>
          <button onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))} className="rounded-lg border border-[var(--color-border)] p-2 hover:bg-[var(--color-bg)]" aria-label="Next month">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-border)] text-xs">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="bg-[var(--color-surface)] px-2 py-2 text-center font-medium text-[var(--color-text-muted)]">{d}</div>
          ))}
          {gridDays.map((day, idx) => {
            const dayEvents = events.filter((e) => isSameDay(e.date, day));
            const inMonth = isSameMonth(day, cursor);
            const isToday = isSameDay(day, today);
            return (
              <div key={idx} className={`min-h-[92px] bg-[var(--color-surface)] p-1.5 ${inMonth ? "" : "opacity-40"}`}>
                <p className={`mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs ${isToday ? "bg-[var(--color-primary)] text-white" : "text-[var(--color-text-muted)]"}`}>
                  {day.getDate()}
                </p>
                <div className="space-y-0.5">
                  {dayEvents.slice(0, 3).map((e, i) => (
                    <Link
                      key={i}
                      to={`/hackathons/${e.hackathonId}`}
                      title={`${e.hackathonTitle} · ${e.type}`}
                      className="flex items-center gap-1 truncate rounded px-1 py-0.5 text-[10px] hover:bg-[var(--color-bg)]"
                    >
                      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${TYPE_DOT[e.type]}`} />
                      <span className="truncate">{e.hackathonTitle}</span>
                    </Link>
                  ))}
                  {dayEvents.length > 3 && (
                    <p className="px-1 text-[10px] text-[var(--color-text-muted)]">+{dayEvents.length - 3} more</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-xs text-[var(--color-text-muted)]">
          {(Object.keys(TYPE_DOT) as CalEvent["type"][]).map((t) => (
            <span key={t} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${TYPE_DOT[t]}`} /> {t}
            </span>
          ))}
        </div>
      </div>

      {events.length === 0 && (
        <p className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
          <CalendarDays className="h-4 w-4" /> No dated events yet — add a hackathon to populate the calendar.
        </p>
      )}
    </div>
  );
}
