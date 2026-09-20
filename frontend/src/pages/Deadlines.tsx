import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { AlarmClockCheck } from "lucide-react";
import LoadingState from "@/components/LoadingState";
import EmptyState from "@/components/EmptyState";
import { useHackathonStore } from "@/store/hackathonStore";
import { bucketForDate, formatDate, getCountdown } from "@/utils/date";
import type { DeadlineBucket } from "@/utils/date";

interface DeadlineItem {
  hackathonId: string;
  hackathonTitle: string;
  type: string;
  date: string;
}

const BUCKET_ORDER: DeadlineBucket[] = ["Today", "Tomorrow", "This Week", "Next Week", "Later", "Passed"];

export default function Deadlines() {
  const { hackathons, isLoading, fetchAll, hasLoaded } = useHackathonStore();

  useEffect(() => {
    if (!hasLoaded) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const grouped = useMemo(() => {
    const items: DeadlineItem[] = [];
    hackathons.forEach((h) => {
      if (h.registrationDeadline) {
        items.push({ hackathonId: h._id, hackathonTitle: h.title, type: "Registration Deadline", date: h.registrationDeadline });
      }
      if (h.submissionDeadline) {
        items.push({ hackathonId: h._id, hackathonTitle: h.title, type: "Submission Deadline", date: h.submissionDeadline });
      }
      if (h.startDate) {
        items.push({ hackathonId: h._id, hackathonTitle: h.title, type: "Hackathon Start", date: h.startDate });
      }
    });

    const buckets: Record<DeadlineBucket, DeadlineItem[]> = {
      Today: [], Tomorrow: [], "This Week": [], "Next Week": [], Later: [], Passed: [],
    };
    items.forEach((item) => {
      buckets[bucketForDate(item.date)].push(item);
    });
    Object.values(buckets).forEach((list) =>
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    );
    return buckets;
  }, [hackathons]);

  const totalItems = Object.values(grouped).reduce((sum, list) => sum + list.length, 0);

  if (isLoading && !hasLoaded) return <LoadingState label="Loading deadlines…" />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Upcoming Deadlines</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Every registration, submission, and start date, grouped by urgency.</p>
      </div>

      {totalItems === 0 ? (
        <EmptyState
          icon={AlarmClockCheck}
          title="No deadlines yet"
          description="Add a hackathon with dates to see them grouped here."
          actionLabel="Add Hackathon"
          actionTo="/hackathons/new"
        />
      ) : (
        BUCKET_ORDER.map((bucket) => {
          const list = grouped[bucket];
          if (list.length === 0) return null;
          return (
            <div key={bucket}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">
                {bucket} <span className="ml-1 text-xs font-normal">({list.length})</span>
              </h2>
              <div className="divide-y divide-[var(--color-border)] overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
                {list.map((item, idx) => {
                  const countdown = getCountdown(item.date);
                  return (
                    <Link
                      key={`${item.hackathonId}-${item.type}-${idx}`}
                      to={`/hackathons/${item.hackathonId}`}
                      className="flex flex-wrap items-center justify-between gap-2 px-5 py-3 text-sm hover:bg-[var(--color-bg)]"
                    >
                      <div>
                        <p className="font-medium">{item.hackathonTitle}</p>
                        <p className="text-[var(--color-text-muted)]">{item.type} · {formatDate(item.date)}</p>
                      </div>
                      <span className={`text-xs font-semibold ${countdown?.isPast ? "text-red-600 dark:text-red-400" : "text-[var(--color-primary)]"}`}>
                        {countdown?.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
