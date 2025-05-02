import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Home, User, Eye, EyeOff, Mail, Lock, ArrowLeft, FileText, Upload } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../store/authStore";

export default function SignUpScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [wing, setWing] = useState("");
  const [flatNumber, setFlatNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<"owner" | "tenant" | "visitor">("owner");
  const [govtId, setGovtId] = useState<string | null>(null);
  const [rentalAgreement, setRentalAgreement] = useState<string | null>(null);
  
  const router = useRouter();
  const { signUp, isLoading, error, clearError } = useAuthStore();

  const pickGovtId = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setGovtId(result.assets[0].uri);
    }
  };

  const pickRentalAgreement = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setRentalAgreement(result.assets[0].uri);
    }
  };

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword || !wing || !flatNumber) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if ((userType === "owner" || userType === "tenant") && (!govtId || !rentalAgreement)) {
      Alert.alert("Error", "Please upload required documents");
      return;
    }

    try {
      // Sign up with the selected user type
      await signUp(email, password, userType, {
        fullName,
        wing,
        flatNumber,
        govtId,
        rentalAgreement
      });
      
      // Navigate based on user type
      if (userType === "visitor") {
        router.replace("/visitor");
      } else {
        router.replace("/(tabs)/dashboard");
      }
    } catch (err) {
      // Error is already handled in the store
      console.log("Sign up failed:", err);
    }
  };

  // Clear any previous errors when component mounts or unmounts
  React.useEffect(() => {
    clearError();
    return () => clearError();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create Account</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Text style={styles.formLabel}>I am a:</Text>
          <View style={styles.userTypeContainer}>
            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === "owner" && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType("owner")}
              disabled={isLoading}
            >
              <Home size={18} color={userType === "owner" ? "#fff" : "#3b5998"} />
              <Text
                style={[
                  styles.userTypeText,
                  userType === "owner" && styles.userTypeTextActive,
                ]}
              >
                Owner
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === "tenant" && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType("tenant")}
              disabled={isLoading}
            >
              <User size={18} color={userType === "tenant" ? "#fff" : "#3b5998"} />
              <Text
                style={[
                  styles.userTypeText,
                  userType === "tenant" && styles.userTypeTextActive,
                ]}
              >
                Tenant
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === "visitor" && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType("visitor")}
              disabled={isLoading}
            >
              <User size={18} color={userType === "visitor" ? "#fff" : "#3b5998"} />
              <Text
                style={[
                  styles.userTypeText,
                  userType === "visitor" && styles.userTypeTextActive,
                ]}
              >
                Visitor
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.formLabel}>Full Name</Text>
          <View style={styles.inputContainer}>
            <User size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Email</Text>
          <View style={styles.inputContainer}>
            <Mail size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Password</Text>
          <View style={styles.inputContainer}>
            <Lock size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </Pressable>
          </View>

          <Text style={styles.formLabel}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Lock size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
            />
            <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
            </Pressable>
          </View>

          <Text style={styles.formLabel}>Wing</Text>
          <View style={styles.inputContainer}>
            <Home size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your wing (e.g., A, B, C)"
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
              placeholder="Enter your flat number (e.g., 101, 202)"
              value={flatNumber}
              onChangeText={setFlatNumber}
              editable={!isLoading}
            />
          </View>

          {(userType === "owner" || userType === "tenant") && (
            <>
              <Text style={styles.formLabel}>Government ID</Text>
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={pickGovtId}
                disabled={isLoading}
              >
                <Upload size={20} color="#3b5998" />
                <Text style={styles.uploadButtonText}>
                  {govtId ? "ID Uploaded" : "Upload ID"}
                </Text>
              </TouchableOpacity>

              <Text style={styles.formLabel}>Rental Agreement</Text>
              <TouchableOpacity 
                style={styles.uploadButton} 
                onPress={pickRentalAgreement}
                disabled={isLoading}
              >
                <FileText size={20} color="#3b5998" />
                <Text style={styles.uploadButtonText}>
                  {rentalAgreement ? "Agreement Uploaded" : "Upload Agreement"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity 
            style={[styles.createAccountButton, isLoading && styles.createAccountButtonDisabled]} 
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.createAccountButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  userTypeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 10,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d9e6",
    backgroundColor: "#fff",
    gap: 6,
  },
  userTypeButtonActive: {
    backgroundColor: "#3b5998",
    borderColor: "#3b5998",
  },
  userTypeText: {
    fontSize: 14,
    color: "#3b5998",
    fontWeight: "500",
  },
  userTypeTextActive: {
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
  eyeIcon: {
    padding: 8,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#d1d9e6",
    borderRadius: 8,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: "#f5f7fa",
    gap: 10,
  },
  uploadButtonText: {
    color: "#3b5998",
    fontSize: 15,
    fontWeight: "500",
  },
  createAccountButton: {
    backgroundColor: "#3b5998",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  createAccountButtonDisabled: {
    backgroundColor: "#a0aec0",
  },
  createAccountButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});