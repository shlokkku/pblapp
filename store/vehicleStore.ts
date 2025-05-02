import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  addVehicle: (vehicle: Omit<Vehicle, "id">) => void;
  updateVehicle: (id: string, vehicle: Partial<Omit<Vehicle, "id">>) => void;
  deleteVehicle: (id: string) => void;
  getVehicleById: (id: string) => Vehicle | undefined;
}

export const useVehicleStore = create<VehicleState>()(
  persist(
    (set, get) => ({
      vehicles: [
        {
          id: "1",
          type: "4-Wheeler",
          make: "Toyota",
          model: "Camry",
          color: "Silver",
          licensePlate: "ABC123",
          parkingSpot: "A-12",
        },
      ],
      addVehicle: (vehicle) => {
        const newVehicle = {
          ...vehicle,
          id: Date.now().toString(),
        };
        set((state) => ({
          vehicles: [...state.vehicles, newVehicle],
        }));
      },
      updateVehicle: (id, updatedVehicle) => {
        set((state) => ({
          vehicles: state.vehicles.map((vehicle) =>
            vehicle.id === id ? { ...vehicle, ...updatedVehicle } : vehicle
          ),
        }));
      },
      deleteVehicle: (id) => {
        set((state) => ({
          vehicles: state.vehicles.filter((vehicle) => vehicle.id !== id),
        }));
      },
      getVehicleById: (id) => {
        return get().vehicles.find((vehicle) => vehicle.id === id);
      },
    }),
    {
      name: "vehicle-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);