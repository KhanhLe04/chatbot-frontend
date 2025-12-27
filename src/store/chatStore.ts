import { create } from "zustand";
import { Message } from "@/types";

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clear: () => void;
}

export const chatStore = create<ChatState>((set) => ({
  messages: [],

  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  setMessages: (messages: Message[]) => {
    set({ messages });
  },

  clear: () => {
    set({ messages: [] });
  },
}));

