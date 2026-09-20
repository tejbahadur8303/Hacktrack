import { create } from "zustand";
import type { Hackathon, HackathonInput } from "@/types/hackathon";
import * as hackathonService from "@/services/hackathonService";
import type { HackathonQuery } from "@/services/hackathonService";

interface HackathonState {
  hackathons: Hackathon[];
  isLoading: boolean;
  error: string | null;
  hasLoaded: boolean;
  fetchAll: (query?: HackathonQuery) => Promise<void>;
  add: (payload: Partial<HackathonInput>) => Promise<Hackathon>;
  edit: (id: string, payload: Partial<HackathonInput>) => Promise<Hackathon>;
  remove: (id: string) => Promise<void>;
}

export const useHackathonStore = create<HackathonState>((set, get) => ({
  hackathons: [],
  isLoading: false,
  error: null,
  hasLoaded: false,

  fetchAll: async (query) => {
    set({ isLoading: true, error: null });
    try {
      const data = await hackathonService.fetchHackathons(query);
      set({ hackathons: data, isLoading: false, hasLoaded: true });
    } catch (err) {
      set({ isLoading: false, error: (err as Error).message });
    }
  },

  add: async (payload) => {
    const created = await hackathonService.createHackathon(payload);
    set({ hackathons: [created, ...get().hackathons] });
    return created;
  },

  edit: async (id, payload) => {
    const updated = await hackathonService.updateHackathon(id, payload);
    set({
      hackathons: get().hackathons.map((h) => (h._id === id ? updated : h)),
    });
    return updated;
  },

  remove: async (id) => {
    await hackathonService.deleteHackathon(id);
    set({ hackathons: get().hackathons.filter((h) => h._id !== id) });
  },
}));
