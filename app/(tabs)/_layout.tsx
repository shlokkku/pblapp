import React from "react";
import { Tabs } from "expo-router";
import { Home, Bell, User, Settings, UserPlus } from "lucide-react-native";
import { useAuthStore } from "@/store/authStore";

export default function TabLayout() {
  const { userType } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3b5998",
        tabBarInactiveTintColor: "#8a8a8a",
        tabBarStyle: {
          borderTopColor: "#e0e0e0",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: "#fff",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: "#eaeaea",
        },
        headerTitleStyle: {
          fontWeight: "600",
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => <Bell size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="register"
        options={{
          title: "Register",
          tabBarIcon: ({ color }) => <UserPlus size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="my-details"
        options={{
          title: "My Details",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}