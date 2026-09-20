import { api } from "./api";
import type { Hackathon, HackathonInput } from "@/types/hackathon";

export interface HackathonQuery {
  search?: string;
  status?: string;
  mode?: string;
  domain?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export async function fetchHackathons(query: HackathonQuery = {}): Promise<Hackathon[]> {
  const res = await api.get("/hackathons", { params: query });
  return res.data.data;
}

export async function fetchHackathonById(id: string): Promise<Hackathon & { reminders: unknown[] }> {
  const res = await api.get(`/hackathons/${id}`);
  return res.data.data;
}

export async function createHackathon(payload: Partial<HackathonInput>): Promise<Hackathon> {
  const res = await api.post("/hackathons", payload);
  return res.data.data;
}

export async function updateHackathon(id: string, payload: Partial<HackathonInput>): Promise<Hackathon> {
  const res = await api.put(`/hackathons/${id}`, payload);
  return res.data.data;
}

export async function deleteHackathon(id: string): Promise<void> {
  await api.delete(`/hackathons/${id}`);
}
