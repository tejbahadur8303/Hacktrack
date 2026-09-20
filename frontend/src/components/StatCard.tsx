import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: string;
}

export default function StatCard({ label, value, icon: Icon, accent = "text-[var(--color-primary)]" }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-[var(--color-text-muted)]">{label}</p>
        <Icon className={`h-5 w-5 ${accent}`} />
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </div>
  );
}
