import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export default function EmptyState({ icon: Icon, title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 text-center">
      <Icon className="h-10 w-10 text-[var(--color-text-muted)]" />
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--color-text-muted)]">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
