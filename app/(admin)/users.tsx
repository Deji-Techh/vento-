import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import {
  UserPlus,
  Package,
  Users,
  Search,
  X,
} from "lucide-react-native";
import { AppButton } from "../../src/components/ui/AppButton";

const mockAgents = [
  {
    id: "agent-001",
    is_active: true,
    is_online: true,
    total_earnings: 45000,
    completed_deliveries: 23,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    profiles: { name: "Emeka Rider", phone: "+2348000000004" },
  },
  {
    id: "agent-002",
    is_active: true,
    is_online: false,
    total_earnings: 28000,
    completed_deliveries: 15,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(),
    profiles: { name: "Ngozi Okonkwo", phone: "+2348000000007" },
  },
];

const mockAvailableUsers = [
  { id: "user-001", name: "Adebayo Johnson", phone: "+2348012345690" },
  { id: "user-002", name: "Fatima Ibrahim", phone: "+2348012345691" },
];

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [addTab, setAddTab] = useState<"existing" | "new">("existing");

  const [searchQuery, setSearchQuery] = useState("");
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setAgents(mockAgents);
      setLoading(false);
    }, 800);
  }, []);

  const searchUsers = () => {
    if (!searchQuery.trim()) return;
    setSearchingUsers(true);
    setTimeout(() => {
      setAvailableUsers(mockAvailableUsers);
      setSearchingUsers(false);
    }, 500);
  };

  const addExistingUserAsAgent = async () => {
    if (!selectedUserId) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const user = mockAvailableUsers.find((u) => u.id === selectedUserId);
      if (user) {
        const newAgent = {
          id: `agent-${Date.now()}`,
          is_active: true,
          is_online: false,
          total_earnings: 0,
          completed_deliveries: 0,
          created_at: new Date().toISOString(),
          profiles: { name: user.name, phone: user.phone },
        };
        setAgents((prev) => [newAgent, ...prev]);
      }
      Alert.alert("Success", "Delivery agent added successfully");
      setIsAddOpen(false);
      resetForm();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to add agent");
    } finally {
      setSubmitting(false);
    }
  };

  const createNewAgent = async () => {
    if (!newUserName || !newUserEmail) {
      Alert.alert("Error", "Name and email are required");
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      const newAgent = {
        id: `agent-${Date.now()}`,
        is_active: true,
        is_online: false,
        total_earnings: 0,
        completed_deliveries: 0,
        created_at: new Date().toISOString(),
        profiles: { name: newUserName, phone: newUserPhone },
      };
      setAgents((prev) => [newAgent, ...prev]);
      Alert.alert(
        "Success",
        "Delivery agent created. They will receive an email to set their password."
      );
      setIsAddOpen(false);
      resetForm();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create agent");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSearchQuery("");
    setAvailableUsers([]);
    setSelectedUserId(null);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPhone("");
  };

  const toggleAgentStatus = (agentId: string, isActive: boolean) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, is_active: !isActive } : a))
    );
    Alert.alert("Agent status updated");
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAF5EA]">
        <ActivityIndicator size="large" color="#1B1B8F" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#FAF5EA] px-5 pt-14" contentContainerStyle={{ paddingBottom: 120, gap: 16 }}>
      <View className="flex-row items-center justify-between gap-3">
        <View className="flex-1">
          <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-ink/55">
            Team
          </Text>
          <Text className="text-[28px] font-bold text-ink mt-1">
            Agents
          </Text>
          <Text className="text-sm text-ink/55">Manage delivery personnel</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsAddOpen(true)}
          className="bg-ink px-5 h-14 rounded-full flex-row items-center gap-1.5"
        >
          <UserPlus color="#FFFFFF" size={16} />
          <Text className="text-white font-bold text-sm">Add Agent</Text>
        </TouchableOpacity>
      </View>

      {/* Stats white cards */}
      <View className="flex-row gap-3">
        <View className="bg-white rounded-[26px] p-4 border border-[#E7E0D2] flex-1 items-center">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
            <Users color="#1B1B8F" size={20} />
          </View>
          <Text className="text-2xl font-bold text-ink mt-2">{agents.length}</Text>
          <Text className="text-xs text-ink/55">Total Agents</Text>
        </View>
        <View className="bg-white rounded-[26px] p-4 border border-[#E7E0D2] flex-1 items-center">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
            <Package color="#12805C" size={20} />
          </View>
          <Text className="text-2xl font-bold text-ink mt-2">
            {agents.filter((a) => a.is_active).length}
          </Text>
          <Text className="text-xs text-ink/55">Active</Text>
        </View>
        <View className="bg-white rounded-[26px] p-4 border border-[#E7E0D2] flex-1 items-center">
          <View className="w-11 h-11 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
            <Package color="#1B1B8F" size={20} />
          </View>
          <Text className="text-2xl font-bold text-ink mt-2">
            {agents.filter((a) => a.is_online).length}
          </Text>
          <Text className="text-xs text-ink/55">Online Now</Text>
        </View>
      </View>

      {/* Agent List */}
      <View>
        <Text className="text-lg font-bold text-ink mb-3">
          All Agents
        </Text>
        {agents.length === 0 ? (
          <View className="bg-white rounded-[26px] p-8 items-center border border-[#E7E0D2]">
            <Users color="#6E6A75" size={22} />
            <Text className="text-ink/55 mt-3 font-semibold text-center">
              No delivery agents yet. Add one to get started.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {agents.map((agent) => (
              <View
                key={agent.id}
                className="bg-white rounded-[26px] p-5 border border-[#E7E0D2]"
              >
                <View className="flex-row items-center justify-between gap-3">
                  <View className="flex-1 flex-row items-center gap-3">
                    <View className="w-12 h-12 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] items-center justify-center">
                      <Text className="text-ink font-bold">
                        {agent.profiles?.name?.charAt(0) || "?"}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-bold text-ink">
                        {agent.profiles?.name || "Unknown"}
                      </Text>
                      <View className="flex-row gap-3 mt-1">
                        <Text className="text-xs text-ink/55 font-semibold">
                          ₦{(agent.total_earnings || 0).toLocaleString()}
                        </Text>
                        <Text className="text-xs text-ink/55">
                          {agent.completed_deliveries || 0} deliveries
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View className="items-end gap-2">
                    <View
                      className={`px-2.5 py-1 rounded-full ${agent.is_active ? "bg-[#E3F2E8]" : "bg-[#FAF5EA] border border-[#E7E0D2]"}`}
                    >
                      <Text
                        className="text-[11px] font-bold"
                        style={{ color: agent.is_active ? "#12805C" : "#6E6A75" }}
                      >
                        {agent.is_active ? "Active" : "Inactive"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        toggleAgentStatus(agent.id, agent.is_active)
                      }
                      className="border border-[#E7E0D2] bg-white px-3.5 h-10 rounded-full items-center justify-center"
                    >
                      <Text className="text-xs font-bold text-ink">
                        {agent.is_active ? "Deactivate" : "Activate"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Add Agent Modal */}
      <Modal
        visible={isAddOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setIsAddOpen(false);
          resetForm();
        }}
      >
        <View className="flex-1 bg-[#FAF5EA]">
          <View className="flex-row items-center justify-between px-5 pt-6 pb-4">
            <Text className="text-xl font-bold text-ink">Add Delivery Agent</Text>
            <TouchableOpacity
              onPress={() => {
                setIsAddOpen(false);
                resetForm();
              }}
              className="w-10 h-10 rounded-full bg-white border border-[#E7E0D2] items-center justify-center"
            >
              <X color="#0A0A0E" size={16} />
            </TouchableOpacity>
          </View>

          <View className="flex-1 px-5">
            {/* Tab Toggle pill */}
            <View className="flex-row gap-2 mb-4 bg-white border border-[#E7E0D2] rounded-full p-1.5">
              <TouchableOpacity
                onPress={() => setAddTab("existing")}
                className={`flex-1 h-14 rounded-full items-center justify-center ${
                  addTab === "existing" ? "bg-ink" : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-bold text-sm ${
                    addTab === "existing" ? "text-white" : "text-ink"
                  }`}
                >
                  Existing User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAddTab("new")}
                className={`flex-1 h-14 rounded-full items-center justify-center ${
                  addTab === "new" ? "bg-ink" : "bg-transparent"
                }`}
              >
                <Text
                  className={`font-bold text-sm ${
                    addTab === "new" ? "text-white" : "text-ink"
                  }`}
                >
                  New User
                </Text>
              </TouchableOpacity>
            </View>

            {addTab === "existing" ? (
              <View className="gap-4">
                <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-4">
                  <View className="flex-row gap-2">
                    <TextInput
                      placeholder="Search by name..."
                      placeholderTextColor="#9CA3AF"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      onSubmitEditing={searchUsers}
                      className="flex-1 h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
                    />
                    <TouchableOpacity
                      onPress={searchUsers}
                      className="w-14 h-14 bg-ink rounded-full items-center justify-center"
                    >
                      {searchingUsers ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Search color="#FFFFFF" size={20} />
                      )}
                    </TouchableOpacity>
                  </View>

                  {availableUsers.length > 0 && (
                    <View className="bg-[#FAF5EA] border border-[#E7E0D2] rounded-2xl mt-3 overflow-hidden">
                      {availableUsers.map((u) => (
                        <TouchableOpacity
                          key={u.id}
                          onPress={() => setSelectedUserId(u.id)}
                          className={`p-3.5 ${selectedUserId === u.id ? "bg-white border border-[#1B1B8F] rounded-2xl" : ""}`}
                        >
                          <Text className="font-bold text-ink">{u.name}</Text>
                          {u.phone && (
                            <Text className="text-sm text-ink/55">
                              {u.phone}
                            </Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {searchQuery && availableUsers.length === 0 && !searchingUsers && (
                    <Text className="text-sm text-ink/55 text-center py-4">
                      No users found
                    </Text>
                  )}
                </View>

                <AppButton title={submitting ? "Adding..." : "Add Selected User as Agent"} variant="ink" onPress={addExistingUserAsAgent} disabled={!selectedUserId || submitting} />
              </View>
            ) : (
              <View className="gap-4">
                <View className="bg-white rounded-[26px] border border-[#E7E0D2] p-5 gap-4">
                  <View>
                    <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55 mb-2">
                      Full Name *
                    </Text>
                    <TextInput
                      placeholder="Enter full name"
                      placeholderTextColor="#9CA3AF"
                      value={newUserName}
                      onChangeText={setNewUserName}
                      className="w-full h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
                    />
                  </View>
                  <View>
                    <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55 mb-2">
                      Email *
                    </Text>
                    <TextInput
                      placeholder="Enter email address"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="email-address"
                      value={newUserEmail}
                      onChangeText={setNewUserEmail}
                      className="w-full h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
                    />
                  </View>
                  <View>
                    <Text className="text-[11px] font-bold uppercase tracking-[1px] text-ink/55 mb-2">
                      Phone (optional)
                    </Text>
                    <TextInput
                      placeholder="Enter phone number"
                      placeholderTextColor="#9CA3AF"
                      keyboardType="phone-pad"
                      value={newUserPhone}
                      onChangeText={setNewUserPhone}
                      className="w-full h-14 px-4 rounded-full bg-[#FAF5EA] border border-[#E7E0D2] text-ink"
                    />
                  </View>
                </View>
                <AppButton title={submitting ? "Creating..." : "Create New Agent"} variant="ink" onPress={createNewAgent} disabled={!newUserName || !newUserEmail || submitting} />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
