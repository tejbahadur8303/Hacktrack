import { create } from "zustand";
import type { AuthUser } from "@/types/auth";
import * as authService from "@/services/authService";
import { TOKEN_STORAGE_KEY } from "@/services/api";

interface AuthState {
  user: AuthUser | null;
  isInitializing: boolean;
  isSubmitting: boolean;
  error: string | null;
  isAuthenticated: () => boolean;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isInitializing: true,
  isSubmitting: false,
  error: null,

  isAuthenticated: () => Boolean(window.localStorage.getItem(TOKEN_STORAGE_KEY)) && Boolean(get().user),

  bootstrap: async () => {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      set({ isInitializing: false });
      return;
    }
    try {
      const user = await authService.fetchMe();
      set({ user, isInitializing: false });
    } catch {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
      set({ user: null, isInitializing: false });
    }
  },

  login: async (email, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const { token, user } = await authService.loginRequest(email, password);
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      set({ user, isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: (err as Error).message });
      throw err;
    }
  },

  register: async (name, email, password) => {
    set({ isSubmitting: true, error: null });
    try {
      const { token, user } = await authService.registerRequest(name, email, password);
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
      set({ user, isSubmitting: false });
    } catch (err) {
      set({ isSubmitting: false, error: (err as Error).message });
      throw err;
    }
  },

  logout: () => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    set({ user: null });
  },
}));
