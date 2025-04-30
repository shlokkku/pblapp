import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";
import { useAuthStore } from "./authStore";

interface Vehicle {
  id: string;
  type: string;
  make: string;
  model: string;
  color: string;
  licensePlate: string;
  parkingSpot?: string;
}

interface VehicleState {
  vehicles: Vehicle[];
  isLoading: boolean;
  error: string | null;
  fetchVehicles: () => Promise<void>;
  addVehicle: (vehicle: Omit<Vehicle, "id">) => Promise<void>;
  updateVehicle: (id: string, vehicle: Partial<Omit<Vehicle, "id">>) => Promise<void>;
  deleteVehicle: (id: string) => Promise<void>;
  getVehicleById: (id: string) => Vehicle | undefined;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [],
      isLoading: false,
      error: null,
      
      fetchVehicles: async () => {
        const { user } = useAuthStore.getState();
        if (!user?.token) return;
    
        try {
          set({ isLoading: true, error: null });
          const data = await api.vehicles.getAll(user.token);
          set({ vehicles: data, isLoading: false });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to fetch vehicles" 
          });
        }
      },
      
      addVehicle: async (vehicle) => {
        const { user } = useAuthStore.getState();
        if (!user?.token) return;
    
        try {
          set({ isLoading: true, error: null });
          const newVehicle = await api.vehicles.create(vehicle, user.token);
          
          set(state => ({
            vehicles: [...state.vehicles, newVehicle],
            isLoading: false
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to add vehicle" 
          });
        }
      },
      
      updateVehicle: async (id, updatedVehicle) => {
        const { user } = useAuthStore.getState();
        if (!user?.token) return;
    
        try {
          set({ isLoading: true, error: null });
          await api.vehicles.update(id, updatedVehicle, user.token);
          
          set(state => ({
            vehicles: state.vehicles.map(vehicle =>
              vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
            ),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to update vehicle" 
          });
        }
      },
      
      deleteVehicle: async (id) => {
        const { user } = useAuthStore.getState();
        if (!user?.token) return;
    
        try {
          set({ isLoading: true, error: null });
          await api.vehicles.delete(id, user.token);
          
          set(state => ({
            vehicles: state.vehicles.filter(vehicle => vehicle.id !== id),
            isLoading: false
          }));
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : "Failed to delete vehicle" 
          });
        }
      },
      
      getVehicleById: (id) => {
        return get().vehicles.find(vehicle => vehicle.id === id);
      },
    }),
    {
      name: "vehicle-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);