import { create } from "zustand";
import { api } from "../services/api";
import { useAuthStore } from "./authStore";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: "alert" | "success" | "info";
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  isLoading: false,
  error: null,

  fetchNotifications: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      const data = await api.notifications.getAll(user.token);
      set({ notifications: data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch notifications" 
      });
    }
  },

  markAsRead: async (id) => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      await api.notifications.markAsRead(id, user.token);
      
      // Update local state
      set(state => ({
        notifications: state.notifications.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to mark notification as read" 
      });
    }
  }
}));