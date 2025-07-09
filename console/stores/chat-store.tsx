import { ConfigField } from "@/app/chats/components/types";
import { create } from "zustand";

export interface ChatItem {
  id: string;
  name: string;
  systemPrompt: string;
  configs?: ConfigField[];
}

interface ChatStore {
  chats: ChatItem[];
  addChat: () => ChatItem;
  updateSystemPrompt: (id: string, prompt: string) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chats: [],
  addChat: () => {
    const newChat: ChatItem = {
      id: crypto.randomUUID(),
      name: `Chat ${get().chats.length + 1}`,
      systemPrompt: "",
    };
    set((state) => ({
      chats: [...state.chats, newChat],
    }));
    return newChat;
  },
  updateSystemPrompt: (id: string, prompt: string) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === id ? { ...chat, systemPrompt: prompt } : chat
      ),
    }));
  },
}));
