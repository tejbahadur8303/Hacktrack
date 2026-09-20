import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ListChecks } from "lucide-react";
import HackathonCard from "@/components/HackathonCard";
import EmptyState from "@/components/EmptyState";
import LoadingState from "@/components/LoadingState";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useHackathonStore } from "@/store/hackathonStore";
import { HACKATHON_STATUSES, HACKATHON_MODES } from "@/types/hackathon";

const selectClass =
  "rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]";

export default function MyHackathons() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hackathons, isLoading, fetchAll, remove } = useHackathonStore();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const mode = searchParams.get("mode") || "";
  const domain = searchParams.get("domain") || "";
  const sortBy = searchParams.get("sortBy") || "startDate";

  useEffect(() => {
    fetchAll({ search, status, mode, domain, sortBy });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, mode, domain, sortBy]);

  function updateParam(key: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  }

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      toast.success("Hackathon deleted");
      setDeleteId(null);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const domains = Array.from(new Set(hackathons.map((h) => h.domain).filter(Boolean))) as string[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Hackathons</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Search, filter, and manage every hackathon you're tracking.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => updateParam("search", e.target.value)}
          placeholder="Search by name…"
          className="min-w-[200px] flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--color-primary)]"
        />
        <select className={selectClass} value={status} onChange={(e) => updateParam("status", e.target.value)}>
          <option value="">All statuses</option>
          {HACKATHON_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className={selectClass} value={mode} onChange={(e) => updateParam("mode", e.target.value)}>
          <option value="">All modes</option>
          {HACKATHON_MODES.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select className={selectClass} value={domain} onChange={(e) => updateParam("domain", e.target.value)}>
          <option value="">All domains</option>
          {domains.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className={selectClass} value={sortBy} onChange={(e) => updateParam("sortBy", e.target.value)}>
          <option value="startDate">Sort by event date</option>
          <option value="submissionDeadline">Sort by submission deadline</option>
          <option value="title">Sort by name</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingState label="Loading hackathons…" />
      ) : hackathons.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No hackathons found"
          description="Try adjusting your filters, or add a new hackathon to start tracking it."
          actionLabel="Add Hackathon"
          actionTo="/hackathons/new"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hackathons.map((h) => (
            <HackathonCard key={h._id} hackathon={h} onDelete={setDeleteId} />
          ))}
        </div>
      )}

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
