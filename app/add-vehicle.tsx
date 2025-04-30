import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Car, X, AlertCircle } from "lucide-react-native";
import { useVehicleStore } from "../store/vehicleStore";

export default function AddVehicleScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addVehicle, updateVehicle, getVehicleById } = useVehicleStore();
  
  const isEditMode = params.mode === "edit";
  const vehicleId = params.id as string;
  
  const [vehicleType, setVehicleType] = useState<"4-Wheeler" | "2-Wheeler" | "Other">("4-Wheeler");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [licensePlate, setLicensePlate] = useState("");

  useEffect(() => {
    if (isEditMode && vehicleId) {
      const vehicle = getVehicleById(vehicleId);
      if (vehicle) {
        setVehicleType(vehicle.type as "4-Wheeler" | "2-Wheeler" | "Other");
        setMake(vehicle.make);
        setModel(vehicle.model);
        setColor(vehicle.color);
        setLicensePlate(vehicle.licensePlate);
      }
    }
  }, [isEditMode, vehicleId]);

  const handleSave = () => {
    if (!make || !model || !color || !licensePlate) {
      alert("Please fill in all fields");
      return;
    }

    const vehicleData = {
      type: vehicleType,
      make,
      model,
      color,
      licensePlate,
    };

    if (isEditMode && vehicleId) {
      updateVehicle(vehicleId, vehicleData);
    } else {
      addVehicle(vehicleData);
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add New Vehicle</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Vehicle Type</Text>
          <View style={styles.vehicleTypeContainer}>
            <TouchableOpacity
              style={[
                styles.vehicleTypeButton,
                vehicleType === "4-Wheeler" && styles.vehicleTypeButtonActive,
              ]}
              onPress={() => setVehicleType("4-Wheeler")}
            >
              <Text
                style={[
                  styles.vehicleTypeText,
                  vehicleType === "4-Wheeler" && styles.vehicleTypeTextActive,
                ]}
              >
                4-Wheeler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.vehicleTypeButton,
                vehicleType === "2-Wheeler" && styles.vehicleTypeButtonActive,
              ]}
              onPress={() => setVehicleType("2-Wheeler")}
            >
              <Text
                style={[
                  styles.vehicleTypeText,
                  vehicleType === "2-Wheeler" && styles.vehicleTypeTextActive,
                ]}
              >
                2-Wheeler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.vehicleTypeButton,
                vehicleType === "Other" && styles.vehicleTypeButtonActive,
              ]}
              onPress={() => setVehicleType("Other")}
            >
              <Text
                style={[
                  styles.vehicleTypeText,
                  vehicleType === "Other" && styles.vehicleTypeTextActive,
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.formLabel}>Make</Text>
          <View style={styles.inputContainer}>
            <Car size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g., Toyota, Honda"
              value={make}
              onChangeText={setMake}
            />
          </View>

          <Text style={styles.formLabel}>Model</Text>
          <View style={styles.inputContainer}>
            <Car size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g., Camry, Civic"
              value={model}
              onChangeText={setModel}
            />
          </View>

          <Text style={styles.formLabel}>Color</Text>
          <View style={styles.inputContainer}>
            <Car size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g., Red, Blue, Silver"
              value={color}
              onChangeText={setColor}
            />
          </View>

          <Text style={styles.formLabel}>License Plate Number</Text>
          <View style={styles.inputContainer}>
            <Car size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="e.g., ABC123"
              value={licensePlate}
              onChangeText={setLicensePlate}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.noteContainer}>
            <AlertCircle size={18} color="#666" />
            <Text style={styles.noteText}>
              Note: Parking spot will be assigned by the admin after verification.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  vehicleTypeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  vehicleTypeButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d9e6",
    backgroundColor: "#fff",
  },
  vehicleTypeButtonActive: {
    backgroundColor: "#3b5998",
    borderColor: "#3b5998",
  },
  vehicleTypeText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  vehicleTypeTextActive: {
    color: "#fff",
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
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    marginBottom: 20,
    gap: 10,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  cancelButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d9e6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  saveButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#3b5998",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#fff",
  },
});