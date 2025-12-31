import { create } from "zustand";
import { Message } from "@/types";

interface ChatState {
  messages: Message[];
  addMessage: (message: Message) => void;
  setMessages: (messages: Message[]) => void;
  clear: () => void;
  updateLastMessage: (content: string) => void;
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

  updateLastMessage: (content: string) => {
    set((state) => {
      const messages = [...state.messages];
      const lastMessage = messages[messages.length - 1];

      if (lastMessage && lastMessage.role === "assistant") {
        messages[messages.length - 1] = {
          ...lastMessage,
          content: lastMessage.content + content,
        };
      }
      return { messages };
    });
  },
}));

