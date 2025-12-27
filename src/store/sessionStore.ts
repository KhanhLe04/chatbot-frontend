import { create } from "zustand";
import { Session } from "@/types";
import { api } from "@/lib/api";
import { authStore } from "./authStore";

interface SessionState {
  sessions: Session[];
  currentSessionId: string | null;
  setSessions: (sessions: Session[]) => void;
  setCurrentSessionId: (sessionId: string | null) => void;
  addSession: (session: Session) => void;
  removeSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => Promise<void>;
  clear: () => void;
}

export const sessionStore = create<SessionState>((set, get) => ({
  sessions: [],
  currentSessionId: null,

  setSessions: (sessions: Session[]) => {
    set({ sessions });
  },

  setCurrentSessionId: (sessionId: string | null) => {
    set({ currentSessionId: sessionId });
  },

  addSession: (session: Session) => {
    set((state) => ({
      sessions: [session, ...state.sessions],
    }));
  },

  deleteSession: async (sessionId: string) => {
    try {
      const user = authStore.getState().user;
      if (!user) return;

      // Optimistic update
      get().removeSession(sessionId);

      await api.delete(`/history/${user.user_id}/${sessionId}`);
    } catch (error) {
      console.error("Failed to delete session:", error);
      // Re-fetch sessions on error to revert optimistic update
      // For now, we just log. 
      // Ideally we would rollback, but fetching everything implies 
      // we need to know what was deleted to put it back exactly, 
      // or just re-fetch the list.
    }
  },

  removeSession: (sessionId: string) => {
    set((state) => ({
      sessions: state.sessions.filter((s) => s.session_id !== sessionId),
      currentSessionId:
        state.currentSessionId === sessionId ? null : state.currentSessionId,
    }));
  },

  clear: () => {
    set({
      sessions: [],
      currentSessionId: null,
    });
  },
}));

