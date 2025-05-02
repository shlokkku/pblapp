import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, Home, Briefcase, Calendar, Clock, Settings, LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/store/authStore";
import { useVisitorStore } from "@/store/visitorStore";

export default function VisitorScreen() {
  const router = useRouter();
  const { signOut, user } = useAuthStore();
  const { registerVisitor, visitors, fetchVisitors, isLoading, error } = useVisitorStore();
  
  const [residentName, setResidentName] = useState("");
  const [wing, setWing] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [purpose, setPurpose] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("");

  // Fetch visitor's upcoming visits
  React.useEffect(() => {
    if (user?.token) {
      fetchVisitors();
    }
  }, [user]);

  const handleRequestVisit = async () => {
    if (!residentName || !wing || !flatNumber || !purpose || !visitDate || !visitTime) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      await registerVisitor({
        name: user?.fullName || "Visitor",
        visiting: residentName,
        wing,
        flat: flatNumber,
        purpose,
        date: visitDate,
        time: visitTime
      });
      
      Alert.alert("Success", "Visit request submitted successfully!");
      
      // Reset form
      setResidentName("");
      setWing("");
      setFlatNumber("");
      setPurpose("");
      setVisitDate("");
      setVisitTime("");
    } catch (err) {
      Alert.alert("Error", error || "Failed to register visit");
    }
  };

  const handleSettings = () => {
    router.push("/settings");
  };

  const handleSignOut = () => {
    signOut();
    router.replace("/sign-in");
  };

  // Filter only approved visits for this visitor
  const approvedVisits = visitors.filter(visit => 
    visit.status === "approved" && visit.name === user?.fullName
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.headerWithSettings}>
          <Text style={styles.headerTitle}>Register Visit</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleSettings}
            >
              <Settings size={24} color="#3b5998" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleSignOut}
            >
              <LogOut size={24} color="#e74c3c" />
            </TouchableOpacity>
          </View>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Resident Name</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter resident's name"
              value={residentName}
              onChangeText={setResidentName}
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Wing</Text>
          <View style={styles.inputContainer}>
            <Home size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter wing (e.g., A, B, C)"
              value={wing}
              onChangeText={setWing}
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Flat Number</Text>
          <View style={styles.inputContainer}>
            <Home size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter flat number (e.g., 101, 202)"
              value={flatNumber}
              onChangeText={setFlatNumber}
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Purpose of Visit</Text>
          <View style={styles.inputContainer}>
            <Briefcase size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g., Meeting, Delivery, etc."
              value={purpose}
              onChangeText={setPurpose}
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
            onPress={handleRequestVisit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Request Visit</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.upcomingVisitsContainer}>
          <Text style={styles.sectionTitle}>Your Upcoming Visits</Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#3b5998" style={styles.loadingIndicator} />
          ) : approvedVisits.length > 0 ? (
            approvedVisits.map(visit => (
              <View key={visit.id} style={styles.visitCard}>
                <View style={styles.visitHeader}>
                  <Text style={styles.visitTitle}>Visit to {visit.visiting}</Text>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Approved</Text>
                  </View>
                </View>
                <View style={styles.visitDetail}>
                  <Home size={16} color="#666" />
                  <Text style={styles.visitDetailText}>
                    {visit.wing ? `Wing ${visit.wing}, ` : ""}
                    Flat: {visit.flat}
                  </Text>
                </View>
                <View style={styles.visitDetail}>
                  <Briefcase size={16} color="#666" />
                  <Text style={styles.visitDetailText}>{visit.purpose}</Text>
                </View>
                <View style={styles.visitDetail}>
                  <Calendar size={16} color="#666" />
                  <Text style={styles.visitDetailText}>{visit.date}</Text>
                </View>
                <View style={styles.visitDetail}>
                  <Clock size={16} color="#666" />
                  <Text style={styles.visitDetailText}>{visit.time}</Text>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No upcoming visits</Text>
              <Text style={styles.emptyStateSubtext}>Your approved visits will appear here</Text>
            </View>
          )}
        </View>
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
  headerWithSettings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerButtons: {
    flexDirection: "row",
    gap: 16,
  },
  headerButton: {
    padding: 4,
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
  upcomingVisitsContainer: {
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
  loadingIndicator: {
    marginVertical: 20,
  },
  visitCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  visitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  visitTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    backgroundColor: "#d1fae5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#10b981",
  },
  visitDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  visitDetailText: {
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    alignItems: "center",
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});