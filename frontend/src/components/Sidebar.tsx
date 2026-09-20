import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ListChecks,
  PlusCircle,
  CalendarDays,
  BellRing,
  AlarmClockCheck,
  BarChart3,
  Settings as SettingsIcon,
  Rocket,
} from "lucide-react";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/hackathons", label: "My Hackathons", icon: ListChecks },
  { to: "/hackathons/new", label: "Add Hackathon", icon: PlusCircle },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/deadlines", label: "Upcoming Deadlines", icon: AlarmClockCheck },
  { to: "/reminders", label: "Reminders", icon: BellRing },
  { to: "/statistics", label: "Statistics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

interface SidebarProps {
  open: boolean;
  onNavigate?: () => void;
}

export default function Sidebar({ open, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] transition-transform duration-200 lg:static lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center gap-2 px-6 py-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
          <Rocket className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold leading-none">HackTrack</p>
          <p className="text-xs text-[var(--color-text-muted)]">Personal tracker</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text)] hover:bg-[var(--color-bg)]"
              }`
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] px-6 py-4 text-xs text-[var(--color-text-muted)]">
        Built for personal use only
      </div>
    </aside>
  );
}
