import { useEffect, useState } from "react";
import { Moon, Sun, Wifi, WifiOff } from "lucide-react";
import { useThemeStore } from "@/store/themeStore";
import { api } from "@/services/api";

export default function Settings() {
  const { theme, setTheme } = useThemeStore();
  const [apiStatus, setApiStatus] = useState<"checking" | "connected" | "unreachable">("checking");

  useEffect(() => {
    api
      .get("/health")
      .then(() => setApiStatus("connected"))
      .catch(() => setApiStatus("unreachable"));
  }, []);

  const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5050/api";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--color-text-muted)]">Personal preferences for this HackTrack instance.</p>
      </div>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Appearance</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme("light")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
              theme === "light" ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : "border-[var(--color-border)] hover:bg-[var(--color-bg)]"
            }`}
          >
            <Sun className="h-4 w-4" /> Light
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium ${
              theme === "dark" ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white" : "border-[var(--color-border)] hover:bg-[var(--color-bg)]"
            }`}
          >
            <Moon className="h-4 w-4" /> Dark
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--color-text-muted)]">Backend Connection</h2>
        <div className="flex items-center gap-3 text-sm">
          {apiStatus === "connected" && <Wifi className="h-4 w-4 text-emerald-500" />}
          {apiStatus === "unreachable" && <WifiOff className="h-4 w-4 text-red-500" />}
          {apiStatus === "checking" && <Wifi className="h-4 w-4 animate-pulse text-[var(--color-text-muted)]" />}
          <span>
            {apiStatus === "connected" && "Connected to the HackTrack API"}
            {apiStatus === "unreachable" && "Could not reach the HackTrack API"}
            {apiStatus === "checking" && "Checking connection…"}
          </span>
        </div>
        <p className="mt-2 break-all text-xs text-[var(--color-text-muted)]">{baseURL}</p>
        {apiStatus === "unreachable" && (
          <p className="mt-2 text-xs text-[var(--color-text-muted)]">
            Make sure the backend server is running and VITE_API_BASE_URL in your frontend .env points to it.
          </p>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-sm text-[var(--color-text-muted)]">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide">About</h2>
        <p>HackTrack is a personal hackathon tracker. All data lives in your own MongoDB database — there's no public sharing or multi-user access built in.</p>
      </section>
    </div>
  );
}
