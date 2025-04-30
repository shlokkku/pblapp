import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Pressable, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useRouter } from "expo-router";
import { Home, User, Eye, EyeOff, Mail, Lock } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../store/authStore";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"owner" | "tenant" | "visitor">("owner");
  const router = useRouter();
  const { signIn, isLoading, error, clearError } = useAuthStore();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password");
      return;
    }
    
    try {
      // Sign in with the selected user type
      await signIn(email, password, userType);
      
      // Navigate based on user type
      if (userType === "visitor") {
        router.replace("/visitor");
      } else {
        router.replace("/(tabs)/dashboard");
      }
    } catch (err) {
      // Error is already handled in the store
      console.log("Sign in failed:", err);
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
        <Text style={styles.headerText}>Sign In</Text>
      </View>

      <View style={styles.logoContainer}>
        <LinearGradient
          colors={["#5b7fbd", "#3b5998"]}
          style={styles.logoBackground}
        >
          <Text style={styles.logoText}>VM</Text>
        </LinearGradient>
        <Text style={styles.title}>Visitor Management</Text>
        <Text style={styles.subtitle}>by YellowCube Company</Text>
      </View>

      <View style={styles.formContainer}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Text style={styles.formLabel}>Sign in as:</Text>
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[
              styles.userTypeButton,
              userType === "owner" && styles.userTypeButtonActive,
            ]}
            onPress={() => setUserType("owner")}
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
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoading}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
          </Pressable>
        </View>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.signInButton, isLoading && styles.signInButtonDisabled]} 
          onPress={handleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Don't have an account? </Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity disabled={isLoading}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eaeaea",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 30,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  logoText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#3b5998",
    fontSize: 14,
  },
  signInButton: {
    backgroundColor: "#3b5998",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  signInButtonDisabled: {
    backgroundColor: "#a0aec0",
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signUpText: {
    color: "#666",
    fontSize: 14,
  },
  signUpLink: {
    color: "#3b5998",
    fontSize: 14,
    fontWeight: "600",
  },
});