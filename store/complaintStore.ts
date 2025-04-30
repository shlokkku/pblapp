import { create } from "zustand";
import { api } from "../services/api";
import { useAuthStore } from "./authStore";

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "resolved";
  date: string;
  images: string[];
}

interface ComplaintState {
  complaints: Complaint[];
  isLoading: boolean;
  error: string | null;
  fetchComplaints: () => Promise<void>;
  createComplaint: (complaintData: Omit<Complaint, "id" | "status" | "date">) => Promise<void>;
  updateComplaintStatus: (id: string, status: "pending" | "in-progress" | "resolved") => Promise<void>;
}

export const useComplaintStore = create<ComplaintState>((set) => ({
  complaints: [],
  isLoading: false,
  error: null,

  fetchComplaints: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      const data = await api.complaints.getAll(user.token);
      set({ complaints: data, isLoading: false });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to fetch complaints" 
      });
    }
  },

  createComplaint: async (complaintData) => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      const newComplaint = await api.complaints.create({
        ...complaintData,
        status: "pending",
        date: new Date().toISOString()
      }, user.token);
      
      // Add to local state
      set(state => ({
        complaints: [...state.complaints, newComplaint],
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to create complaint" 
      });
    }
  },

  updateComplaintStatus: async (id, status) => {
    const { user } = useAuthStore.getState();
    if (!user?.token) return;

    try {
      set({ isLoading: true, error: null });
      await api.complaints.update(id, status, user.token);
      
      // Update local state
      set(state => ({
        complaints: state.complaints.map(complaint => 
          complaint.id === id ? { ...complaint, status } : complaint
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : "Failed to update complaint status" 
      });
    }
  }
}));