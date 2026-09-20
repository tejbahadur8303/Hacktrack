import { api } from "./api";
import type { DashboardStats } from "@/types/dashboard";

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const res = await api.get("/dashboard/stats");
  return res.data.data;
}
