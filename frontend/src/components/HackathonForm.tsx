import { useState } from "react";
import type { FormEvent } from "react";
import type { Hackathon, HackathonInput } from "@/types/hackathon";
import { HACKATHON_STATUSES, HACKATHON_MODES, HACKATHON_DOMAINS } from "@/types/hackathon";

interface HackathonFormProps {
  initial?: Partial<Hackathon>;
  submitLabel: string;
  onSubmit: (payload: Partial<HackathonInput>) => Promise<void>;
}

function toDateInputValue(value?: string) {
  if (!value) return "";
  return value.slice(0, 10);
}

const inputClass =
  "w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]";
const labelClass = "mb-1 block text-sm font-medium text-[var(--color-text-muted)]";

export default function HackathonForm({ initial, submitLabel, onSubmit }: HackathonFormProps) {
  const [form, setForm] = useState({
    title: initial?.title || "",
    organizer: initial?.organizer || "",
    websiteUrl: initial?.websiteUrl || "",
    registrationDate: toDateInputValue(initial?.registrationDate),
    registrationDeadline: toDateInputValue(initial?.registrationDeadline),
    startDate: toDateInputValue(initial?.startDate),
    endDate: toDateInputValue(initial?.endDate),
    submissionDeadline: toDateInputValue(initial?.submissionDeadline),
    resultDate: toDateInputValue(initial?.resultDate),
    mode: initial?.mode || "Online",
    location: initial?.location || "",
    domain: initial?.domain || "",
    teamName: initial?.teamName || "",
    teamMembers: initial?.teamMembers?.join(", ") || "",
    description: initial?.description || "",
    notes: initial?.notes || "",
    status: initial?.status || "Interested",
    problemStatementUrl: initial?.problemStatementUrl || "",
    githubRepoUrl: initial?.githubRepoUrl || "",
    submissionUrl: initial?.submissionUrl || "",
    technologiesUsed: initial?.technologiesUsed?.join(", ") || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Hackathon name is required.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      const payload: Partial<HackathonInput> = {
        ...form,
        teamMembers: form.teamMembers
          ? form.teamMembers.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        technologiesUsed: form.technologiesUsed
          ? form.technologiesUsed.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        registrationDate: form.registrationDate || undefined,
        registrationDeadline: form.registrationDeadline || undefined,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        submissionDeadline: form.submissionDeadline || undefined,
        resultDate: form.resultDate || undefined,
      };
      await onSubmit(payload);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Basics</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelClass}>Hackathon Name *</label>
            <input className={inputClass} value={form.title} onChange={(e) => update("title", e.target.value)} required />
          </div>
          <div>
            <label className={labelClass}>Organizer</label>
            <input className={inputClass} value={form.organizer} onChange={(e) => update("organizer", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Website URL</label>
            <input className={inputClass} value={form.websiteUrl} onChange={(e) => update("websiteUrl", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Mode</label>
            <select className={inputClass} value={form.mode} onChange={(e) => update("mode", e.target.value as typeof form.mode)}>
              {HACKATHON_MODES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <input className={inputClass} value={form.location} onChange={(e) => update("location", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Domain</label>
            <input list="domains" className={inputClass} value={form.domain} onChange={(e) => update("domain", e.target.value)} />
            <datalist id="domains">
              {HACKATHON_DOMAINS.map((d) => <option key={d} value={d} />)}
            </datalist>
          </div>
          <div>
            <label className={labelClass}>Status</label>
            <select className={inputClass} value={form.status} onChange={(e) => update("status", e.target.value as typeof form.status)}>
              {HACKATHON_STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Important Dates</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className={labelClass}>Registration Date</label>
            <input type="date" className={inputClass} value={form.registrationDate} onChange={(e) => update("registrationDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Registration Deadline</label>
            <input type="date" className={inputClass} value={form.registrationDeadline} onChange={(e) => update("registrationDeadline", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Hackathon Start Date</label>
            <input type="date" className={inputClass} value={form.startDate} onChange={(e) => update("startDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Hackathon End Date</label>
            <input type="date" className={inputClass} value={form.endDate} onChange={(e) => update("endDate", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Submission Deadline</label>
            <input type="date" className={inputClass} value={form.submissionDeadline} onChange={(e) => update("submissionDeadline", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Result Announcement Date (optional)</label>
            <input type="date" className={inputClass} value={form.resultDate} onChange={(e) => update("resultDate", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Team & Notes</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Team Name</label>
            <input className={inputClass} value={form.teamName} onChange={(e) => update("teamName", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Team Members (comma separated)</label>
            <input className={inputClass} value={form.teamMembers} onChange={(e) => update("teamMembers", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Description</label>
            <textarea rows={3} className={inputClass} value={form.description} onChange={(e) => update("description", e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Important Notes</label>
            <textarea rows={3} className={inputClass} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Project Links (optional)</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Problem Statement Link</label>
            <input className={inputClass} value={form.problemStatementUrl} onChange={(e) => update("problemStatementUrl", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>GitHub Repository URL</label>
            <input className={inputClass} value={form.githubRepoUrl} onChange={(e) => update("githubRepoUrl", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Submission URL</label>
            <input className={inputClass} value={form.submissionUrl} onChange={(e) => update("submissionUrl", e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Technologies Used (comma separated)</label>
            <input className={inputClass} value={form.technologiesUsed} onChange={(e) => update("technologiesUsed", e.target.value)} />
          </div>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
        >
          {isSubmitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
