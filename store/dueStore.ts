import { create } from "zustand";
import { api } from "../services/api";
import { useAuthStore } from "./authStore";

interface Due {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "pending" | "overdue" | "paid";
  paidDate?: string;
}

interface DueState {
  dues: Due[];
  isLoading: boolean;
  error: string | null;
  fetchDues: () => Promise<void>;
  payDue: (id: string, paymentDetails: any) => Promise<void>;
}

export const useDueStore = create<DueState>((set) => ({
  dues: [],
  isLoading: false,
  error: null,

  fetchDues: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      const data = await api.dues.getAll(user.token);
      set({ dues: data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch dues" 
      });
    }
  },

  payDue: async (id, paymentDetails) => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      const updatedDue = await api.dues.pay(id, paymentDetails, user.token);
      
      // Update local state
      set(state => ({
        dues: state.dues.map(due => 
          due.id === id ? updatedDue : due
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to process payment" 
      });
    }
  }
}));