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
  wing?: string;
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
        <Text style={styles.visitorDetailText}>
          {item.wing ? `Wing ${item.wing}, ` : ""}
          Flat: {item.flat}
        </Text>
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
          onPress={() => setActiveTab("complaints")}
        >
          <Text style={[styles.tabText, activeTab === "complaints" && styles.activeTabText]}>Complaints</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "dues" && styles.activeTab]}
          onPress={() => setActiveTab("dues")}
        >
          <Text style={[styles.tabText, activeTab === "dues" && styles.activeTabText]}>Dues</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "visitors" && (
        <>
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === "all" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("all")}
            >
              <Text style={[styles.filterText, activeFilter === "all" && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === "pending" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("pending")}
            >
              <Text style={[styles.filterText, activeFilter === "pending" && styles.activeFilterText]}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === "approved" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("approved")}
            >
              <Text style={[styles.filterText, activeFilter === "approved" && styles.activeFilterText]}>Approved</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === "denied" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("denied")}
            >
              <Text style={[styles.filterText, activeFilter === "denied" && styles.activeFilterText]}>Denied</Text>
            </TouchableOpacity>
          </View>

          {visitorsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b5998" />
            </View>
          ) : filteredVisitors.length > 0 ? (
            <FlatList
              data={filteredVisitors}
              renderItem={renderVisitorItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No visitors found</Text>
              <Text style={styles.emptyStateSubtext}>
                {activeFilter !== "all" 
                  ? `No ${activeFilter} visitors at the moment`
                  : "When visitors register, they will appear here"}
              </Text>
            </View>
          )}
        </>
      )}

      {activeTab === "notices" && (
        <>
          {noticesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b5998" />
            </View>
          ) : notices.length > 0 ? (
            <FlatList
              data={notices}
              renderItem={renderNoticeItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No notices found</Text>
              <Text style={styles.emptyStateSubtext}>
                There are no notices at the moment
              </Text>
            </View>
          )}
        </>
      )}

      {activeTab === "complaints" && (
        <>
          <View style={styles.headerWithAction}>
            <Text style={styles.sectionTitle}>Complaints</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push("/add-complaint")}
            >
              <Plus size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          
          {complaintsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b5998" />
            </View>
          ) : complaints.length > 0 ? (
            <FlatList
              data={complaints}
              renderItem={renderComplaintItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No complaints found</Text>
              <Text style={styles.emptyStateSubtext}>
                There are no complaints at the moment
              </Text>
            </View>
          )}
        </>
      )}

      {activeTab === "dues" && (
        <>
          {duesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b5998" />
            </View>
          ) : dues.length > 0 ? (
            <FlatList
              data={dues}
              renderItem={renderDueItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No dues found</Text>
              <Text style={styles.emptyStateSubtext}>
                You have no pending dues at the moment
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );

  // Tenant dashboard with tabs for Notices and Dues
  const TenantDashboard = () => (
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
          style={[styles.tab, activeTab === "dues" && styles.activeTab]}
          onPress={() => setActiveTab("dues")}
        >
          <Text style={[styles.tabText, activeTab === "dues" && styles.activeTabText]}>Dues</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "visitors" && (
        <>
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === "all" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("all")}
            >
              <Text style={[styles.filterText, activeFilter === "all" && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === "pending" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("pending")}
            >
              <Text style={[styles.filterText, activeFilter === "pending" && styles.activeFilterText]}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === "approved" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("approved")}
            >
              <Text style={[styles.filterText, activeFilter === "approved" && styles.activeFilterText]}>Approved</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.filterButton, activeFilter === "denied" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("denied")}
            >
              <Text style={[styles.filterText, activeFilter === "denied" && styles.activeFilterText]}>Denied</Text>
            </TouchableOpacity>
          </View>

          {visitorsLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b5998" />
            </View>
          ) : filteredVisitors.length > 0 ? (
            <FlatList
              data={filteredVisitors}
              renderItem={renderVisitorItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No visitors found</Text>
              <Text style={styles.emptyStateSubtext}>
                {activeFilter !== "all" 
                  ? `No ${activeFilter} visitors at the moment`
                  : "When visitors register, they will appear here"}
              </Text>
            </View>
          )}
        </>
      )}

      {activeTab === "notices" && (
        <>
          {noticesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b5998" />
            </View>
          ) : notices.length > 0 ? (
            <FlatList
              data={notices}
              renderItem={renderNoticeItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No notices found</Text>
              <Text style={styles.emptyStateSubtext}>
                There are no notices at the moment
              </Text>
            </View>
          )}
        </>
      )}

      {activeTab === "dues" && (
        <>
          {duesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b5998" />
            </View>
          ) : dues.length > 0 ? (
            <FlatList
              data={dues}
              renderItem={renderDueItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No dues found</Text>
              <Text style={styles.emptyStateSubtext}>
                You have no pending dues at the moment
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {userType === "owner" && <OwnerDashboard />}
      {userType === "tenant" && <TenantDashboard />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  dashboardContainer: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  headerWithSettings: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  settingsButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerWithAction: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#3b5998",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#333",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#3b5998",
    borderRadius: 6,
  },
  tabText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
  },
  filterContainer: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#eaeaea",
  },
  activeFilterButton: {
    backgroundColor: "#3b5998",
  },
  filterText: {
    fontSize: 13,
    color: "#666",
  },
  activeFilterText: {
    color: "#fff",
  },
  listContainer: {
    paddingBottom: 20,
  },
  visitorCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  visitorHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  visitorName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusPending: {
    backgroundColor: "#fef3c7",
  },
  statusApproved: {
    backgroundColor: "#d1fae5",
  },
  statusDenied: {
    backgroundColor: "#fee2e2",
  },
  statusInProgress: {
    backgroundColor: "#dbeafe",
  },
  statusResolved: {
    backgroundColor: "#d1fae5",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  visitorDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  visitorDetailText: {
    fontSize: 14,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  approveButton: {
    flex: 1,
    backgroundColor: "#10b981",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  approveButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  denyButton: {
    flex: 1,
    backgroundColor: "#ef4444",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  denyButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  noticeCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    position: "relative",
    paddingLeft: 20,
  },
  priorityBadge: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  highPriority: {
    backgroundColor: "#ef4444",
  },
  mediumPriority: {
    backgroundColor: "#f59e0b",
  },
  lowPriority: {
    backgroundColor: "#3b82f6",
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  noticeContent: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  noticeDate: {
    fontSize: 12,
    color: "#999",
  },
  complaintCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  complaintHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  complaintTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  complaintDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  complaintFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  complaintCategory: {
    fontSize: 12,
    color: "#3b5998",
    fontWeight: "500",
  },
  complaintDate: {
    fontSize: 12,
    color: "#999",
  },
  dueCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dueHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dueTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 8,
  },
  dueDetails: {
    marginBottom: 12,
  },
  dueAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  dueDate: {
    fontSize: 14,
    color: "#666",
  },
  paidDate: {
    fontSize: 14,
    color: "#10b981",
    marginTop: 4,
  },
  payButton: {
    backgroundColor: "#3b5998",
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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