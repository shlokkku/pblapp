import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/authStore";

export default function Index() {
  const { isAuthenticated, userType } = useAuthStore();
  
  // Redirect based on authentication status
  if (isAuthenticated) {
    // For visitors, redirect to visitor page
    if (userType === "visitor") {
      return <Redirect href="/visitor" />;
    }
    // For owners and tenants, redirect to dashboard
    return <Redirect href="/(tabs)/dashboard" />;
  }
  
  return <Redirect href="/sign-in" />;
}