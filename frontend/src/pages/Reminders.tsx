import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BellRing, Trash2, Check } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useReminderStore } from "@/store/reminderStore";
import { useHackathonStore } from "@/store/hackathonStore";
import { REMINDER_TYPES } from "@/types/reminder";
import type { ReminderType } from "@/types/reminder";
import { formatDateTime } from "@/utils/date";

const PRESET_OFFSETS: { label: string; days: number | null }[] = [
  { label: "1 day before", days: 1 },
  { label: "3 days before", days: 3 },
  { label: "7 days before", days: 7 },
  { label: "Custom date & time", days: null },
];

const inputClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]";
const labelClass = "mb-1 block text-sm font-medium text-[var(--color-text-muted)]";

export default function Reminders() {
  const [searchParams] = useSearchParams();
  const preselectedHackathon = searchParams.get("hackathonId") || "";

  const { reminders, isLoading, fetchAll, add, edit, remove } = useReminderStore();
  const { hackathons, fetchAll: fetchHackathons, hasLoaded } = useHackathonStore();

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    hackathonId: preselectedHackathon,
    title: "",
    reminderType: "Custom" as ReminderType,
    offsetLabel: "Custom date & time",
    customDate: "",
  });

  useEffect(() => {
    fetchAll();
    if (!hasLoaded) fetchHackathons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const relevantDeadline = useMemo(() => {
    const hackathon = hackathons.find((h) => h._id === form.hackathonId);
    if (!hackathon) return null;
    switch (form.reminderType) {
      case "Registration Deadline": return hackathon.registrationDeadline || null;
      case "Hackathon Start": return hackathon.startDate || null;
      case "Submission Deadline": return hackathon.submissionDeadline || null;
      case "Presentation Date": return hackathon.resultDate || null;
      default: return null;
    }
  }, [form.hackathonId, form.reminderType, hackathons]);

  function computeReminderDate(): string | null {
    const preset = PRESET_OFFSETS.find((p) => p.label === form.offsetLabel);
    if (preset?.days != null) {
      if (!relevantDeadline) return null;
      const base = new Date(relevantDeadline);
      base.setDate(base.getDate() - preset.days);
      return base.toISOString();
    }
    if (!form.customDate) return null;
    return new Date(form.customDate).toISOString();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.hackathonId) {
      toast.error("Choose a hackathon first.");
      return;
    }
    const reminderDate = computeReminderDate();
    if (!reminderDate) {
      toast.error("Choose a valid reminder date.");
      return;
    }
    try {
      await add({
        hackathonId: form.hackathonId,
        title: form.title || `${form.reminderType} reminder`,
        reminderType: form.reminderType,
        reminderDate,
      });
      toast.success("Reminder added");
      setForm({ ...form, title: "", customDate: "" });
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function toggleEnabled(id: string, isEnabled: boolean) {
    try {
      await edit(id, { isEnabled: !isEnabled });
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function markCompleted(id: string) {
    try {
      await edit(id, { isCompleted: true });
      toast.success("Marked as completed");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      toast.success("Reminder deleted");
      setDeleteId(null);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Reminders</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Scheduled server-side — reminders fire even if HackTrack isn't open in your browser.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Add Reminder</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2">
            <label className={labelClass}>Hackathon</label>
            <select
              className={inputClass}
              value={form.hackathonId}
              onChange={(e) => setForm({ ...form, hackathonId: e.target.value })}
            >
              <option value="">Select a hackathon</option>
              {hackathons.map((h) => <option key={h._id} value={h._id}>{h.title}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>Reminder For</label>
            <select
              className={inputClass}
              value={form.reminderType}
              onChange={(e) => setForm({ ...form, reminderType: e.target.value as ReminderType })}
            >
              {REMINDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>When</label>
            <select
              className={inputClass}
              value={form.offsetLabel}
              onChange={(e) => setForm({ ...form, offsetLabel: e.target.value })}
            >
              {PRESET_OFFSETS.map((p) => <option key={p.label} value={p.label}>{p.label}</option>)}
            </select>
          </div>
          {form.offsetLabel === "Custom date & time" && (
            <div>
              <label className={labelClass}>Custom Date & Time</label>
              <input
                type="datetime-local"
                className={inputClass}
                value={form.customDate}
                onChange={(e) => setForm({ ...form, customDate: e.target.value })}
              />
            </div>
          )}
          <div className="sm:col-span-2 lg:col-span-3">
            <label className={labelClass}>Note (optional)</label>
            <input
              className={inputClass}
              placeholder="e.g. Finish README before submitting"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
        </div>
        {form.offsetLabel !== "Custom date & time" && !relevantDeadline && form.hackathonId && (
          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
            This hackathon has no date set for "{form.reminderType}" — pick Custom or add that date to the hackathon first.
          </p>
        )}
        <div className="mt-4 flex justify-end">
          <button type="submit" className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]">
            Add Reminder
          </button>
        </div>
      </form>

      {isLoading ? (
        <LoadingState label="Loading reminders…" />
      ) : reminders.length === 0 ? (
        <EmptyState icon={BellRing} title="No reminders yet" description="Add a reminder above to get notified before a deadline." />
      ) : (
        <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          {reminders.map((r) => {
            const hackathonTitle = typeof r.hackathonId === "object" ? r.hackathonId.title : "";
            return (
              <div key={r._id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div>
                  <p className={`font-medium ${r.isCompleted ? "line-through text-[var(--color-text-muted)]" : ""}`}>{r.title}</p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {hackathonTitle} · {r.reminderType} · {formatDateTime(r.reminderDate)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)]">
                    <input type="checkbox" checked={r.isEnabled} onChange={() => toggleEnabled(r._id, r.isEnabled)} />
                    Enabled
                  </label>
                  {!r.isCompleted && (
                    <button
                      onClick={() => markCompleted(r._id)}
                      className="rounded-lg border border-[var(--color-border)] p-2 hover:bg-[var(--color-bg)]"
                      aria-label="Mark completed"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => setDeleteId(r._id)}
                    className="rounded-lg border border-[var(--color-border)] p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    aria-label="Delete reminder"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this reminder?"
        description="You won't be notified for it anymore."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
