import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AlertTriangle, X, Camera, Upload } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useComplaintStore } from "../store/complaintStore";

export default function AddComplaintScreen() {
  const router = useRouter();
  const { createComplaint, isLoading, error } = useComplaintStore();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"maintenance" | "security" | "noise" | "other">("maintenance");
  const [images, setImages] = useState<string[]>([]);

  const handleAddImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      await createComplaint({
        title,
        description,
        category,
        images
      });
      
      Alert.alert("Success", "Complaint submitted successfully!");
      router.back();
    } catch (err) {
      Alert.alert("Error", error || "Failed to submit complaint");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Complaint</Text>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <X size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Title <Text style={styles.requiredStar}>*</Text></Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Brief title of your complaint"
              value={title}
              onChangeText={setTitle}
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Category <Text style={styles.requiredStar}>*</Text></Text>
          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[
                styles.categoryButton,
                category === "maintenance" && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory("maintenance")}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === "maintenance" && styles.categoryTextActive,
                ]}
              >
                Maintenance
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryButton,
                category === "security" && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory("security")}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === "security" && styles.categoryTextActive,
                ]}
              >
                Security
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryButton,
                category === "noise" && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory("noise")}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === "noise" && styles.categoryTextActive,
                ]}
              >
                Noise
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.categoryButton,
                category === "other" && styles.categoryButtonActive,
              ]}
              onPress={() => setCategory("other")}
              disabled={isLoading}
            >
              <Text
                style={[
                  styles.categoryText,
                  category === "other" && styles.categoryTextActive,
                ]}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.formLabel}>Description <Text style={styles.requiredStar}>*</Text></Text>
          <View style={styles.textAreaContainer}>
            <TextInput
              style={styles.textArea}
              placeholder="Describe your complaint in detail..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              editable={!isLoading}
            />
          </View>

          <Text style={styles.formLabel}>Add Photos (Optional)</Text>
          <TouchableOpacity 
            style={styles.addImageButton} 
            onPress={handleAddImage}
            disabled={isLoading}
          >
            <Camera size={20} color="#3b5998" />
            <Text style={styles.addImageButtonText}>Add Photos</Text>
          </TouchableOpacity>

          {images.length > 0 && (
            <View style={styles.imagesPreviewContainer}>
              <Text style={styles.imagesPreviewText}>{images.length} image(s) selected</Text>
            </View>
          )}

          <View style={styles.noteContainer}>
            <AlertTriangle size={18} color="#e74c3c" />
            <Text style={styles.noteText}>
              All complaints are reviewed by the management. False complaints may result in penalties.
            </Text>
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isLoading && styles.submitButtonDisabled]} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Complaint</Text>
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
    flex: 1,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  requiredStar: {
    color: "#e74c3c",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "#d1d9e6",
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  input: {
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d1d9e6",
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: "#3b5998",
    borderColor: "#3b5998",
  },
  categoryText: {
    fontSize: 14,
    color: "#666",
  },
  categoryTextActive: {
    color: "#fff",
  },
  textAreaContainer: {
    borderWidth: 1,
    borderColor: "#d1d9e6",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
    height: 120,
  },
  addImageButton: {
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
  addImageButtonText: {
    color: "#3b5998",
    fontSize: 15,
    fontWeight: "500",
  },
  imagesPreviewContainer: {
    backgroundColor: "#f0f4f9",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  imagesPreviewText: {
    fontSize: 14,
    color: "#3b5998",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
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
  submitButton: {
    backgroundColor: "#3b5998",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: "#a0aec0",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});