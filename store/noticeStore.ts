import { create } from "zustand";
import { api } from "../services/api";
import { useAuthStore } from "./authStore";

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
}

interface NoticeState {
  notices: Notice[];
  isLoading: boolean;
  error: string | null;
  fetchNotices: () => Promise<void>;
  createNotice: (noticeData: Omit<Notice, "id">) => Promise<void>;
}

export const useNoticeStore = create<NoticeState>((set) => ({
  notices: [],
  isLoading: false,
  error: null,

  fetchNotices: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      const data = await api.notices.getAll(user.token);
      set({ notices: data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch notices" 
      });
    }
  },

  createNotice: async (noticeData) => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      const newNotice = await api.notices.create(noticeData, user.token);
      
      // Add to local state
      set(state => ({
        notices: [...state.notices, newNotice],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to create notice" 
      });
    }
  }
}));