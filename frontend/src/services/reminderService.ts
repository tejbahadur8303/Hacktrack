import { api } from "./api";
import type { Reminder, ReminderInput } from "@/types/reminder";

export async function fetchReminders(hackathonId?: string): Promise<Reminder[]> {
  const res = await api.get("/reminders", { params: hackathonId ? { hackathonId } : {} });
  return res.data.data;
}

export async function createReminder(payload: ReminderInput): Promise<Reminder> {
  const res = await api.post("/reminders", payload);
  return res.data.data;
}

export async function updateReminder(id: string, payload: Partial<ReminderInput & { isCompleted: boolean }>): Promise<Reminder> {
  const res = await api.put(`/reminders/${id}`, payload);
  return res.data.data;
}

export async function deleteReminder(id: string): Promise<void> {
  await api.delete(`/reminders/${id}`);
}
