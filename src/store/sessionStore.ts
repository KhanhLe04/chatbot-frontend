import { create } from "zustand";
import { Session } from "@/types";

interface SessionState {
  sessions: Session[];
  currentSessionId: string | null;
  setSessions: (sessions: Session[]) => void;
  setCurrentSessionId: (sessionId: string | null) => void;
  addSession: (session: Session) => void;
  removeSession: (sessionId: string) => void;
  clear: () => void;
}

export const sessionStore = create<SessionState>((set) => ({
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

