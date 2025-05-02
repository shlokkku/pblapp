import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Home, Briefcase, Calendar, Clock, Plus } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useVisitorStore } from "../../store/visitorStore";

export default function RegisterScreen() {
  const { userType, user } = useAuthStore();
  const { registerVisitor, isLoading, error } = useVisitorStore();
  const router = useRouter();
  
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [visitorPurpose, setVisitorPurpose] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");

  // Only owners and tenants can register visitors
  if (userType === "visitor") {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>Access Denied</Text>
          <Text style={styles.emptyStateSubtext}>
            Only owners and tenants can register visitors
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleRegisterVisitor = async () => {
    if (!visitorName || !visitorPhone || !visitorPurpose || !visitDate || !visitTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await registerVisitor({
        name: visitorName,
        visiting: user?.fullName || "Resident",
        wing: user?.wing || "",
        flat: user?.flatNumber || "Unknown",
        purpose: visitorPurpose,
        date: visitDate,
        time: visitTime
      });
      
      Alert.alert("Success", "Visitor registered successfully!");
      
      // Reset form
      setVisitorName("");
      setVisitorPhone("");
      setVisitorPurpose("");
      setVisitDate("");
      setVisitTime("");
    } catch (err) {
      Alert.alert("Error", error || "Failed to register visitor");
    }
  };

  const handleAddComplaint = () => {
    router.push("/add-complaint");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Register Visitor</Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Visitor Name</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter visitor's full name"
              value={visitorName}
              onChangeText={setVisitorName}
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Phone Number</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter visitor's phone number"
              value={visitorPhone}
              onChangeText={setVisitorPhone}
              keyboardType="phone-pad"
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Purpose of Visit</Text>
          <View style={styles.inputContainer}>
            <Briefcase size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g., Meeting, Delivery, etc."
              value={visitorPurpose}
              onChangeText={setVisitorPurpose}
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Visit Date</Text>
          <View style={styles.inputContainer}>
            <Calendar size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="DD/MM/YYYY"
              value={visitDate}
              onChangeText={setVisitDate}
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Visit Time</Text>
          <View style={styles.inputContainer}>
            <Clock size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="HH:MM AM/PM"
              value={visitTime}
              onChangeText={setVisitTime}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]} 
            onPress={handleRegisterVisitor}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Register Visitor</Text>
            )}
          </TouchableOpacity>
        </View>

        {userType === "owner" && (
          <View style={styles.complaintSection}>
            <Text style={styles.sectionTitle}>Have an issue?</Text>
            <TouchableOpacity style={styles.addComplaintButton} onPress={handleAddComplaint}>
              <Plus size={20} color="#fff" />
              <Text style={styles.addComplaintButtonText}>Add Complaint</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  errorContainer: {
    backgroundColor: "#fee2e2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d9e6",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  registerButton: {
    backgroundColor: "#3b5998",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  registerButtonDisabled: {
    backgroundColor: "#a0aec0",
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  complaintSection: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  addComplaintButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  addComplaintButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});