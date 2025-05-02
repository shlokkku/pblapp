import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { User, FileText, Car, ChevronRight, Plus, MapPin, Edit, Trash2 } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { useVehicleStore } from "../../store/vehicleStore";

export default function MyDetailsScreen() {
  const { user, userType } = useAuthStore();
  const { vehicles } = useVehicleStore();
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string>("vehicles");

  const handleViewDocument = (documentType: string) => {
    router.push({
      pathname: "/view-document",
      params: { type: documentType }
    });
  };

  const handleAddVehicle = () => {
    router.push("/add-vehicle");
  };

  const handleEditVehicle = (vehicleId: string) => {
    router.push({
      pathname: "/add-vehicle",
      params: { id: vehicleId, mode: "edit" }
    });
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(""); // Use empty string instead of null
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Details</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{user?.fullName?.charAt(0) || "U"}</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.fullName || "User"}</Text>
            <Text style={styles.profileDetail}>{userType.charAt(0).toUpperCase() + userType.slice(1)}</Text>
            <Text style={styles.profileDetail}>
              {user?.wing ? `Wing ${user.wing}, ` : ""}
              Flat: {user?.flatNumber || "Not specified"}
            </Text>
          </View>
        </View>

        {(userType === "owner" || userType === "tenant") && (
          <View style={styles.documentsCard}>
            <Text style={styles.sectionTitle}>Documents</Text>
            
            <TouchableOpacity 
              style={styles.documentItem}
              onPress={() => handleViewDocument("government_id")}
            >
              <FileText size={20} color="#3b5998" />
              <Text style={styles.documentName}>Government ID</Text>
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.documentItem}
              onPress={() => handleViewDocument("rental_agreement")}
            >
              <FileText size={20} color="#3b5998" />
              <Text style={styles.documentName}>Rental Agreement</Text>
              <ChevronRight size={20} color="#999" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={styles.sectionHeader} 
          onPress={() => toggleSection("vehicles")}
        >
          <View style={styles.sectionTitleContainer}>
            <Car size={20} color="#3b5998" />
            <Text style={styles.sectionTitle}>Vehicles & Parking</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddVehicle}>
            <Plus size={20} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>

        {expandedSection === "vehicles" && (
          <View style={styles.sectionContent}>
            <View style={styles.parkingInfoCard}>
              <Text style={styles.parkingInfoTitle}>Parking Information</Text>
              
              <View style={styles.parkingInfoRow}>
                <Text style={styles.parkingInfoLabel}>Allowed Vehicles:</Text>
                <Text style={styles.parkingInfoValue}>2</Text>
              </View>
              
              <View style={styles.parkingInfoRow}>
                <Text style={styles.parkingInfoLabel}>Assigned Spots:</Text>
                <Text style={styles.parkingInfoValue}>
                  {user?.wing ? `${user.wing}-` : ""}
                  {user?.flatNumber ? `${user.flatNumber}A, ${user.flatNumber}B` : "Not assigned"}
                </Text>
              </View>
              
              <View style={styles.parkingInfoRow}>
                <Text style={styles.parkingInfoLabel}>Guest Parking:</Text>
                <Text style={styles.parkingInfoValue}>Available</Text>
              </View>

              <TouchableOpacity style={styles.parkingRulesButton}>
                <Text style={styles.parkingRulesText}>Parking Rules</Text>
                <ChevronRight size={16} color="#3b5998" />
              </TouchableOpacity>

              <View style={styles.parkingRulesList}>
                <View style={styles.parkingRuleItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.parkingRuleText}>No overnight parking in visitor spots</Text>
                </View>
                <View style={styles.parkingRuleItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.parkingRuleText}>Keep your assigned spot clean</Text>
                </View>
                <View style={styles.parkingRuleItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.parkingRuleText}>Report any issues to management</Text>
                </View>
              </View>
            </View>

            {vehicles.map((vehicle) => (
              <View key={vehicle.id} style={styles.vehicleCard}>
                <View style={styles.vehicleHeader}>
                  <View style={styles.vehicleHeaderLeft}>
                    <Car size={20} color="#3b5998" />
                    <View>
                      <Text style={styles.vehicleName}>{vehicle.make} {vehicle.model}</Text>
                      <Text style={styles.vehiclePlate}>{vehicle.licensePlate}</Text>
                    </View>
                  </View>
                  <View style={styles.vehicleActions}>
                    <TouchableOpacity 
                      style={styles.vehicleActionButton}
                      onPress={() => handleEditVehicle(vehicle.id)}
                    >
                      <Edit size={18} color="#3b5998" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.vehicleActionButton}>
                      <Trash2 size={18} color="#e74c3c" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.vehicleDetails}>
                  <View style={styles.vehicleDetailRow}>
                    <Text style={styles.vehicleDetailLabel}>Type:</Text>
                    <Text style={styles.vehicleDetailValue}>{vehicle.type}</Text>
                  </View>
                  <View style={styles.vehicleDetailRow}>
                    <Text style={styles.vehicleDetailLabel}>Color:</Text>
                    <Text style={styles.vehicleDetailValue}>{vehicle.color}</Text>
                  </View>
                </View>
                
                <View style={styles.parkingSpot}>
                  <MapPin size={16} color="#3b5998" />
                  <Text style={styles.parkingSpotText}>
                    Assigned Spot: {user?.wing ? `${user.wing}-` : ""}
                    {vehicle.parkingSpot || "Pending"}
                  </Text>
                </View>
              </View>
            ))}

            {vehicles.length === 0 && (
              <View style={styles.emptyVehicles}>
                <Text style={styles.emptyVehiclesText}>No vehicles added yet</Text>
                <Text style={styles.emptyVehiclesSubtext}>
                  Add your vehicle details to get a parking spot assigned
                </Text>
              </View>
            )}
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
  profileCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3b5998",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileAvatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  profileInfo: {
    flex: 1,
    justifyContent: "center",
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  profileDetail: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  documentsCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  documentName: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    marginLeft: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3b5998",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  parkingInfoCard: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  parkingInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  parkingInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  parkingInfoLabel: {
    fontSize: 14,
    color: "#666",
  },
  parkingInfoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  parkingRulesButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 8,
  },
  parkingRulesText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3b5998",
  },
  parkingRulesList: {
    marginTop: 8,
  },
  parkingRuleItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#666",
    marginRight: 8,
  },
  parkingRuleText: {
    fontSize: 13,
    color: "#666",
  },
  vehicleCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eaeaea",
  },
  vehicleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  vehicleHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  vehicleName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  vehiclePlate: {
    fontSize: 14,
    color: "#666",
  },
  vehicleActions: {
    flexDirection: "row",
    gap: 8,
  },
  vehicleActionButton: {
    padding: 6,
  },
  vehicleDetails: {
    marginBottom: 12,
  },
  vehicleDetailRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  vehicleDetailLabel: {
    width: 80,
    fontSize: 14,
    color: "#666",
  },
  vehicleDetailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  parkingSpot: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4f9",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    gap: 8,
  },
  parkingSpotText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3b5998",
  },
  emptyVehicles: {
    alignItems: "center",
    padding: 20,
  },
  emptyVehiclesText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  emptyVehiclesSubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});