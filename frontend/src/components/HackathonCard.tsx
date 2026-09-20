import { Link } from "react-router-dom";
import { Pencil, Trash2, Globe2 } from "lucide-react";
import type { Hackathon } from "@/types/hackathon";
import StatusBadge from "./StatusBadge";
import CountdownBadge from "./CountdownBadge";
import { formatDate, getCountdown } from "@/utils/date";

interface HackathonCardProps {
  hackathon: Hackathon;
  onDelete: (id: string) => void;
}

export default function HackathonCard({ hackathon, onDelete }: HackathonCardProps) {
  const nextDeadline =
    hackathon.submissionDeadline && !getCountdown(hackathon.submissionDeadline)?.isPast
      ? hackathon.submissionDeadline
      : hackathon.registrationDeadline;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link to={`/hackathons/${hackathon._id}`} className="text-base font-semibold hover:text-[var(--color-primary)]">
            {hackathon.title}
          </Link>
          {hackathon.organizer && (
            <p className="text-sm text-[var(--color-text-muted)]">{hackathon.organizer}</p>
          )}
        </div>
        <StatusBadge status={hackathon.status} />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-[var(--color-text-muted)]">
        <p>Event: {formatDate(hackathon.startDate)}</p>
        <p>Registration: {formatDate(hackathon.registrationDeadline)}</p>
        <p>Submission: {formatDate(hackathon.submissionDeadline)}</p>
        <p className="flex items-center gap-1">
          {hackathon.mode}
          {hackathon.websiteUrl && <Globe2 className="h-3.5 w-3.5" />}
        </p>
      </div>

      <div className="flex items-center justify-between pt-1">
        <CountdownBadge date={nextDeadline} />
        <div className="flex items-center gap-2">
          <Link
            to={`/hackathons/${hackathon._id}/edit`}
            className="rounded-lg border border-[var(--color-border)] p-2 hover:bg-[var(--color-bg)]"
            aria-label="Edit hackathon"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            onClick={() => onDelete(hackathon._id)}
            className="rounded-lg border border-[var(--color-border)] p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            aria-label="Delete hackathon"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
