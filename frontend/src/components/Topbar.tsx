import { Menu, Moon, Sun, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useThemeStore } from "@/store/themeStore";
import { useAuthStore } from "@/store/authStore";

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { user, logout } = useAuthStore();
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/hackathons${query ? `?search=${encodeURIComponent(query)}` : ""}`);
  }

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-3 backdrop-blur">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 hover:bg-[var(--color-bg)] lg:hidden"
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </button>

      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search hackathons…"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[var(--color-primary)]"
          />
        </div>
      </form>

      <button
        onClick={toggleTheme}
        className="rounded-lg border border-[var(--color-border)] p-2 hover:bg-[var(--color-bg)]"
        aria-label="Toggle theme"
      >
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      {user && (
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-sm text-[var(--color-text-muted)]">{user.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[var(--color-bg)]"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </header>
  );
}
