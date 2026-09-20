import { create } from "zustand";
import type { Reminder, ReminderInput } from "@/types/reminder";
import * as reminderService from "@/services/reminderService";

interface ReminderState {
  reminders: Reminder[];
  isLoading: boolean;
  error: string | null;
  fetchAll: (hackathonId?: string) => Promise<void>;
  add: (payload: ReminderInput) => Promise<Reminder>;
  edit: (id: string, payload: Partial<ReminderInput & { isCompleted: boolean; isEnabled: boolean }>) => Promise<Reminder>;
  remove: (id: string) => Promise<void>;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  isLoading: false,
  error: null,

  fetchAll: async (hackathonId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await reminderService.fetchReminders(hackathonId);
      set({ reminders: data, isLoading: false });
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },

  add: async (payload) => {
    const created = await reminderService.createReminder(payload);
    set({ reminders: [created, ...get().reminders] });
    return created;
  },

  edit: async (id, payload) => {
    const updated = await reminderService.updateReminder(id, payload);
    set({ reminders: get().reminders.map((r) => (r._id === id ? updated : r)) });
    return updated;
  },

  remove: async (id) => {
    await reminderService.deleteReminder(id);
    set({ reminders: get().reminders.filter((r) => r._id !== id) });
  },
}));
