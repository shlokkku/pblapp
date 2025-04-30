import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, ScrollView, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, User, Home, Briefcase, Calendar, Clock, Plus, Settings } from "lucide-react-native";
import { useAuthStore } from "@/store/authStore";
import { useVisitorStore } from "@/store/visitorStore";
import { useNoticeStore } from "@/store/noticeStore";
import { useComplaintStore } from "@/store/complaintStore";
import { useDueStore } from "@/store/dueStore";
import { useRouter } from "expo-router";

// Define types for our data
interface Visitor {
  id: string;
  name: string;
  visiting: string;
  flat: string;
  purpose: string;
  date: string;
  time: string;
  status: "pending" | "approved" | "denied";
}

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "high" | "medium" | "low";
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: "pending" | "in-progress" | "resolved";
  date: string;
  images: string[];
}

interface Due {
  id: string;
  title: string;
  amount: number;
  dueDate: string;
  status: "pending" | "overdue" | "paid";
  paidDate?: string;
}

export default function DashboardScreen() {
  const { userType, user } = useAuthStore();
  const { visitors, fetchVisitors, approveVisitor, denyVisitor, isLoading: visitorsLoading } = useVisitorStore();
  const { notices, fetchNotices, isLoading: noticesLoading } = useNoticeStore();
  const { complaints, fetchComplaints, isLoading: complaintsLoading } = useComplaintStore();
  const { dues, fetchDues, isLoading: duesLoading } = useDueStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState(userType === "owner" ? "visitors" : "notices");
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();

  // Fetch data when component mounts
  useEffect(() => {
    if (userType === "owner" || userType === "tenant") {
      fetchVisitors();
      fetchNotices();
      
      if (userType === "owner") {
        fetchComplaints();
      }
      
      fetchDues();
    }
  }, [userType]);

  // Handle approve visitor
  const handleApproveVisitor = (id: string) => {
    Alert.alert(
      "Approve Visitor",
      "Are you sure you want to approve this visitor?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Approve", 
          onPress: async () => {
            try {
              await approveVisitor(id);
            } catch (error) {
              Alert.alert("Error", "Failed to approve visitor");
            }
          } 
        }
      ]
    );
  };

  // Handle deny visitor
  const handleDenyVisitor = (id: string) => {
    Alert.alert(
      "Deny Visitor",
      "Are you sure you want to deny this visitor?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Deny", 
          onPress: async () => {
            try {
              await denyVisitor(id);
            } catch (error) {
              Alert.alert("Error", "Failed to deny visitor");
            }
          } 
        }
      ]
    );
  };

  // Filter visitors based on search query and active filter
  const filteredVisitors = visitors.filter(visitor => {
    const matchesSearch = visitor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      activeFilter === "all" ? true : 
      activeFilter === "pending" ? visitor.status === "pending" :
      activeFilter === "approved" ? visitor.status === "approved" :
      visitor.status === "denied";
    
    return matchesSearch && matchesFilter;
  });

  const renderVisitorItem = ({ item }: { item: Visitor }) => (
    <View style={styles.visitorCard}>
      <View style={styles.visitorHeader}>
        <Text style={styles.visitorName}>{item.name}</Text>
        <View style={[
          styles.statusBadge,
          item.status === "pending" ? styles.statusPending :
          item.status === "approved" ? styles.statusApproved :
          styles.statusDenied
        ]}>
          <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
        </View>
      </View>
      
      <View style={styles.visitorDetail}>
        <User size={16} color="#666" />
        <Text style={styles.visitorDetailText}>Visiting: {item.visiting}</Text>
      </View>
      
      <View style={styles.visitorDetail}>
        <Home size={16} color="#666" />
        <Text style={styles.visitorDetailText}>Flat: {item.flat}</Text>
      </View>
      
      <View style={styles.visitorDetail}>
        <Briefcase size={16} color="#666" />
        <Text style={styles.visitorDetailText}>{item.purpose}</Text>
      </View>
      
      <View style={styles.visitorDetail}>
        <Calendar size={16} color="#666" />
        <Text style={styles.visitorDetailText}>{item.date}</Text>
      </View>
      
      <View style={styles.visitorDetail}>
        <Clock size={16} color="#666" />
        <Text style={styles.visitorDetailText}>{item.time}</Text>
      </View>

      {(userType === "owner" || userType === "tenant") && item.status === "pending" && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.approveButton}
            onPress={() => handleApproveVisitor(item.id)}
          >
            <Text style={styles.approveButtonText}>Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.denyButton}
            onPress={() => handleDenyVisitor(item.id)}
          >
            <Text style={styles.denyButtonText}>Deny</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderNoticeItem = ({ item }: { item: Notice }) => (
    <View style={styles.noticeCard}>
      <View style={[styles.priorityBadge, 
        item.priority === "high" ? styles.highPriority : 
        item.priority === "medium" ? styles.mediumPriority : 
        styles.lowPriority
      ]} />
      <Text style={styles.noticeTitle}>{item.title}</Text>
      <Text style={styles.noticeContent}>{item.content}</Text>
      <Text style={styles.noticeDate}>{item.date}</Text>
    </View>
  );

  const renderComplaintItem = ({ item }: { item: Complaint }) => (
    <View style={styles.complaintCard}>
      <View style={styles.complaintHeader}>
        <Text style={styles.complaintTitle}>{item.title}</Text>
        <View style={[
          styles.statusBadge,
          item.status === "pending" ? styles.statusPending :
          item.status === "in-progress" ? styles.statusInProgress :
          styles.statusResolved
        ]}>
          <Text style={styles.statusText}>
            {item.status === "in-progress" ? "In Progress" : 
             item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <Text style={styles.complaintDescription}>{item.description}</Text>
      <View style={styles.complaintFooter}>
        <Text style={styles.complaintCategory}>{item.category.charAt(0).toUpperCase() + item.category.slice(1)}</Text>
        <Text style={styles.complaintDate}>{item.date}</Text>
      </View>
    </View>
  );

  const renderDueItem = ({ item }: { item: Due }) => (
    <View style={styles.dueCard}>
      <View style={styles.dueHeader}>
        <Text style={styles.dueTitle}>{item.title}</Text>
        <View style={[
          styles.statusBadge,
          item.status === "pending" ? styles.statusPending :
          item.status === "overdue" ? styles.statusDenied :
          styles.statusApproved
        ]}>
          <Text style={styles.statusText}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <View style={styles.dueDetails}>
        <Text style={styles.dueAmount}>₹{item.amount}</Text>
        <Text style={styles.dueDate}>Due: {item.dueDate}</Text>
        {item.paidDate && <Text style={styles.paidDate}>Paid: {item.paidDate}</Text>}
      </View>
      {item.status === "pending" && (
        <TouchableOpacity style={styles.payButton}>
          <Text style={styles.payButtonText}>Pay Now</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // Owner dashboard with tabs for Visitors, Notices, Complaints, Dues
  const OwnerDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.searchContainer}>
        <Search size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "visitors" && styles.activeTab]}
          onPress={() => setActiveTab("visitors")}
        >
          <Text style={[styles.tabText, activeTab === "visitors" && styles.activeTabText]}>Visitors</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "notices" && styles.activeTab]}
          onPress={() => setActiveTab("notices")}
        >
          <Text style={[styles.tabText, activeTab === "notices" && styles.activeTabText]}>Notices</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "complaints" && styles.activeTab]}