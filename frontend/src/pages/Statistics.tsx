import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from "recharts";
import LoadingState from "@/components/LoadingState";
import StatCard from "@/components/StatCard";
import { fetchDashboardStats } from "@/services/dashboardService";
import type { DashboardStats } from "@/types/dashboard";
import { Trophy, ClipboardCheck, CheckCircle2, XCircle } from "lucide-react";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#a855f7", "#ef4444", "#0ea5e9", "#84cc16", "#ec4899"];

export default function Statistics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch((err) => toast.error((err as Error).message))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading || !stats) return <LoadingState label="Crunching your stats…" />;

  const domainData = Object.entries(stats.byDomain).map(([name, value]) => ({ name, value }));
  const statusData = Object.entries(stats.byStatus).map(([name, value]) => ({ name, value }));
  const monthlyData = Object.entries(stats.monthlyTrend)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([month, count]) => ({ month, count }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Statistics</h1>
        <p className="text-sm text-[var(--color-text-muted)]">A look at your hackathon activity, based on what you've tracked.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Tracked" value={stats.summary.total} icon={Trophy} />
        <StatCard label="Registered" value={stats.summary.registered} icon={ClipboardCheck} />
        <StatCard label="Completed" value={stats.summary.completed} icon={CheckCircle2} accent="text-emerald-500" />
        <StatCard label="Cancelled" value={stats.summary.cancelled} icon={XCircle} accent="text-red-500" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">By Domain</h2>
          {domainData.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={domainData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
                  {domainData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">By Status</h2>
          {statusData.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={60} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Monthly Participation Trend</h2>
        {monthlyData.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">No data yet — add hackathons with start dates to see this trend.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
