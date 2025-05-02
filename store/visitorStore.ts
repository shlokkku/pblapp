import { create } from "zustand";
import { api } from "../services/api";
import { useAuthStore } from "./authStore";

interface Visitor {
  id: string;
  name: string;
  visiting: string;
  wing?: string;
  flat: string;
  purpose: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "denied";
}

interface VisitorState {
  visitors: Visitor[];
  isLoading: boolean;
  error: string | null;
  fetchVisitors: () => Promise<void>;
  approveVisitor: (id: string) => Promise<void>;
  denyVisitor: (id: string) => Promise<void>;
  registerVisitor: (visitorData: Omit<Visitor, "id" | "status">) => Promise<void>;
}

export const useVisitorStore = create<VisitorState>((set, get) => ({
  visitors: [],
  isLoading: false,
  error: null,

  fetchVisitors: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      const data = await api.visitors.getAll(user.token);
      set({ visitors: data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch visitors" 
      });
    }
  },

  approveVisitor: async (id: string) => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      await api.visitors.update(id, "approved", user.token);
      
      // Update local state
      set(state => ({
        visitors: state.visitors.map(visitor => 
          visitor.id === id ? { ...visitor, status: "approved" } : visitor
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to approve visitor" 
      });
    }
  },

  denyVisitor: async (id: string) => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      await api.visitors.update(id, "denied", user.token);
      
      // Update local state
      set(state => ({
        visitors: state.visitors.map(visitor => 
          visitor.id === id ? { ...visitor, status: "denied" } : visitor
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to deny visitor" 
      });
    }
  },

  registerVisitor: async (visitorData) => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      const newVisitor = await api.visitors.create({
        ...visitorData,
        status: "pending"
      }, user.token);
      
      // Add to local state
      set(state => ({
        visitors: [...state.visitors, newVisitor],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to register visitor" 
      });
    }
  }
}));