import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Pencil, Trash2, ExternalLink, Code2, Send } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import StatusBadge from "@/components/StatusBadge";
import CountdownBadge from "@/components/CountdownBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { fetchHackathonById, updateHackathon } from "@/services/hackathonService";
import { useHackathonStore } from "@/store/hackathonStore";
import { formatDate } from "@/utils/date";
import type { Hackathon, HackathonStatus } from "@/types/hackathon";
import { HACKATHON_STATUSES } from "@/types/hackathon";

const TIMELINE_FIELDS: { key: keyof Hackathon; label: string }[] = [
  { key: "registrationDate", label: "Registration Opens" },
  { key: "registrationDeadline", label: "Registration Deadline" },
  { key: "startDate", label: "Hackathon Start" },
  { key: "submissionDeadline", label: "Project Submission" },
  { key: "endDate", label: "Hackathon End" },
  { key: "resultDate", label: "Result Announcement" },
];

export default function HackathonDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const remove = useHackathonStore((s) => s.remove);
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function load() {
    if (!id) return;
    setIsLoading(true);
    try {
      const data = await fetchHackathonById(id);
      setHackathon(data);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleStatusChange(status: HackathonStatus) {
    if (!id || !hackathon) return;
    try {
      const updated = await updateHackathon(id, { status });
      setHackathon({ ...hackathon, ...updated });
      toast.success("Status updated");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  async function handleDelete() {
    if (!id) return;
    try {
      await remove(id);
      toast.success("Hackathon deleted");
      navigate("/hackathons");
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  if (isLoading) return <LoadingState label="Loading hackathon…" />;
  if (!hackathon) return <p className="text-sm text-[var(--color-text-muted)]">Hackathon not found.</p>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{hackathon.title}</h1>
            <StatusBadge status={hackathon.status} />
          </div>
          {hackathon.organizer && <p className="text-sm text-[var(--color-text-muted)]">{hackathon.organizer}</p>}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/hackathons/${hackathon._id}/edit`}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium hover:bg-[var(--color-bg)]"
          >
            <Pencil className="h-4 w-4" /> Edit
          </Link>
          <button
            onClick={() => setConfirmDelete(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        {hackathon.websiteUrl && (
          <a href={hackathon.websiteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 hover:bg-[var(--color-bg)]">
            <ExternalLink className="h-3.5 w-3.5" /> Website
          </a>
        )}
        {hackathon.githubRepoUrl && (
          <a href={hackathon.githubRepoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 hover:bg-[var(--color-bg)]">
            <Code2 className="h-3.5 w-3.5" /> Repository
          </a>
        )}
        {hackathon.submissionUrl && (
          <a href={hackathon.submissionUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 hover:bg-[var(--color-bg)]">
            <Send className="h-3.5 w-3.5" /> Submission
          </a>
        )}
      </div>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Timeline</h2>
        <ol className="space-y-4 border-l border-[var(--color-border)] pl-5">
          {TIMELINE_FIELDS.map(({ key, label }) => {
            const value = hackathon[key] as string | undefined;
            if (!value) return null;
            return (
              <li key={key} className="relative">
                <span className="absolute -left-[26px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                <p className="text-sm font-medium">{label}</p>
                <p className="text-sm text-[var(--color-text-muted)]">{formatDate(value)}</p>
                <div className="mt-1"><CountdownBadge date={value} /></div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm">
          <p className="text-[var(--color-text-muted)]">Mode</p>
          <p className="mt-1 font-medium">{hackathon.mode}{hackathon.location ? ` · ${hackathon.location}` : ""}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm">
          <p className="text-[var(--color-text-muted)]">Domain</p>
          <p className="mt-1 font-medium">{hackathon.domain || "—"}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 text-sm sm:col-span-2">
          <p className="text-[var(--color-text-muted)]">Update Status</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {HACKATHON_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  hackathon.status === s
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                    : "border-[var(--color-border)] hover:bg-[var(--color-bg)]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {(hackathon.teamName || (hackathon.teamMembers && hackathon.teamMembers.length > 0)) && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Team</h2>
          {hackathon.teamName && <p className="font-medium">{hackathon.teamName}</p>}
          {hackathon.teamMembers && hackathon.teamMembers.length > 0 && (
            <p className="mt-1 text-[var(--color-text-muted)]">{hackathon.teamMembers.join(", ")}</p>
          )}
        </section>
      )}

      {hackathon.technologiesUsed && hackathon.technologiesUsed.length > 0 && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {hackathon.technologiesUsed.map((t) => (
              <span key={t} className="rounded-full bg-[var(--color-bg)] px-2.5 py-1 text-xs">{t}</span>
            ))}
          </div>
        </section>
      )}

      {hackathon.description && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Description</h2>
          <p className="whitespace-pre-wrap text-[var(--color-text-muted)]">{hackathon.description}</p>
        </section>
      )}

      {hackathon.notes && (
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Personal Notes</h2>
          <p className="whitespace-pre-wrap text-[var(--color-text-muted)]">{hackathon.notes}</p>
        </section>
      )}

      <div className="text-sm">
        <Link to={`/reminders?hackathonId=${hackathon._id}`} className="font-medium text-[var(--color-primary)] hover:underline">
          Manage reminders for this hackathon →
        </Link>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this hackathon?"
        description="This will remove the hackathon and its reminders. This action can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
