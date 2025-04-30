import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { api } from "../services/api";

export type UserType = "owner" | "tenant" | "visitor";

interface User {
  email: string;
  fullName?: string;
  flatNumber?: string;
  govtId?: string | null;
  rentalAgreement?: string | null;
  token?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  userType: UserType;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  signIn: (email: string, password: string, userType: UserType) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    userType: UserType,
    userData: Partial<User>
  ) => Promise<void>;
  signOut: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      userType: "visitor",
      user: null,
      isLoading: false,
      error: null,
      
      signIn: async (email, password, userType) => {
        try {
          set({ isLoading: true, error: null });
          
          const data = await api.auth.signIn(email, password, userType);
          
          set({
            isAuthenticated: true,
            userType,
            user: {
              email,
              fullName: data.fullName || data.name,
              flatNumber: data.flatNumber,
              token: data.token,
              ...data
            },
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
          });
          throw error;
        }
      },
      
      signUp: async (email, password, userType, userData) => {
        try {
          set({ isLoading: true, error: null });
          
          const requestBody = {
            email,
            password,
            userType,
            fullName: userData.fullName,
            flatNumber: userData.flatNumber,
            // Add other fields as needed
          };
          
          const data = await api.auth.signUp(requestBody);
          
          set({
            isAuthenticated: true,
            userType,
            user: {
              email,
              ...userData,
              token: data.token,
              ...data
            },
            isLoading: false,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'An unknown error occurred' 
          });
          throw error;
        }
      },
      
      signOut: () => {
        set({
          isAuthenticated: false,
          userType: "visitor",
          user: null,
          error: null,
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);