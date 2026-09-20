import type { Hackathon } from "./hackathon";

export interface DashboardStats {
  today: string;
  cards: {
    totalHackathons: number;
    registered: number;
    upcomingEvents: number;
    pendingSubmissions: number;
  };
  summary: {
    total: number;
    registered: number;
    upcoming: number;
    completed: number;
    cancelled: number;
  };
  nextEvent: Hackathon | null;
  nearestDeadline: { hackathon: string; type: string; date: string } | null;
  upcomingHackathons: Hackathon[];
  byDomain: Record<string, number>;
  byStatus: Record<string, number>;
  monthlyTrend: Record<string, number>;
}
