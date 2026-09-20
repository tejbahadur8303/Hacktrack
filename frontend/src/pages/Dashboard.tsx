import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Trophy, ClipboardCheck, CalendarClock, Hourglass } from "lucide-react";
import StatCard from "@/components/StatCard";
import HackathonCard from "@/components/HackathonCard";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ConfirmDialog from "@/components/ConfirmDialog";
import { fetchDashboardStats } from "@/services/dashboardService";
import { useHackathonStore } from "@/store/hackathonStore";
import type { DashboardStats } from "@/types/dashboard";
import { formatDate, getCountdown } from "@/utils/date";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const remove = useHackathonStore((s) => s.remove);

  async function load() {
    setIsLoading(true);
    try {
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      toast.success("Hackathon deleted");
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  if (isLoading || !stats) return <LoadingState label="Loading dashboard…" />;

  const nearestCountdown = stats.nearestDeadline ? getCountdown(stats.nearestDeadline.date) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-[var(--color-text-muted)]">Today is {formatDate(stats.today)}</p>
        </div>
        <Link
          to="/hackathons/new"
          className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)]"
        >
          + Add Hackathon
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Hackathons" value={stats.cards.totalHackathons} icon={Trophy} />
        <StatCard label="Registered" value={stats.cards.registered} icon={ClipboardCheck} />
        <StatCard label="Upcoming Events" value={stats.cards.upcomingEvents} icon={CalendarClock} />
        <StatCard label="Pending Submissions" value={stats.cards.pendingSubmissions} icon={Hourglass} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)]">Next Upcoming Event</h2>
          {stats.nextEvent ? (
            <>
              <p className="mt-2 text-lg font-semibold">{stats.nextEvent.title}</p>
              <p className="text-sm text-[var(--color-text-muted)]">{formatDate(stats.nextEvent.startDate)}</p>
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">No upcoming events scheduled.</p>
          )}
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-sm font-semibold text-[var(--color-text-muted)]">Countdown to Nearest Deadline</h2>
          {stats.nearestDeadline ? (
            <>
              <p className="mt-2 text-lg font-semibold">
                {nearestCountdown?.label} — {stats.nearestDeadline.type}
              </p>
              <p className="text-sm text-[var(--color-text-muted)]">
                {stats.nearestDeadline.hackathon} · {formatDate(stats.nearestDeadline.date)}
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">No upcoming deadlines.</p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming Hackathons</h2>
          <Link to="/hackathons" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
            View all
          </Link>
        </div>
        {stats.upcomingHackathons.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No upcoming hackathons"
            description="Add a hackathon you're planning to join and HackTrack will keep its deadlines in view."
            actionLabel="Add Hackathon"
            actionTo="/hackathons/new"
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stats.upcomingHackathons.map((h) => (
              <HackathonCard key={h._id} hackathon={h} onDelete={setDeleteId} />
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete this hackathon?"
        description="This will remove the hackathon and its reminders. This action can't be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
