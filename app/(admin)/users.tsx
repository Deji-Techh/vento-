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
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white p-6 gap-6">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-gray-900">
            Delivery Agents
          </Text>
          <Text className="text-gray-500">Manage delivery personnel</Text>
        </View>
        <TouchableOpacity
          onPress={() => setIsAddOpen(true)}
          className="bg-blue-900 px-4 py-2 rounded-xl flex-row items-center gap-1"
        >
          <UserPlus color="#FFFFFF" size={16} />
          <Text className="text-white font-semibold text-sm">Add Agent</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View className="flex-row gap-3">
        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex-1 items-center">
          <Users color="#000080" size={24} />
          <Text className="text-2xl font-bold mt-2">{agents.length}</Text>
          <Text className="text-sm text-gray-500">Total Agents</Text>
        </View>
        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex-1 items-center">
          <Package color="#16A34A" size={24} />
          <Text className="text-2xl font-bold mt-2">
            {agents.filter((a) => a.is_active).length}
          </Text>
          <Text className="text-sm text-gray-500">Active</Text>
        </View>
        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex-1 items-center">
          <Package color="#3B82F6" size={24} />
          <Text className="text-2xl font-bold mt-2">
            {agents.filter((a) => a.is_online).length}
          </Text>
          <Text className="text-sm text-gray-500">Online Now</Text>
        </View>
      </View>

      {/* Agent List */}
      <View>
        <Text className="text-lg font-semibold text-gray-900 mb-3">
          All Agents
        </Text>
        {agents.length === 0 ? (
          <View className="bg-gray-50 rounded-xl p-8 items-center border border-gray-200">
            <Users color="#9CA3AF" size={48} />
            <Text className="text-gray-500 mt-3">
              No delivery agents yet. Add one to get started.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {agents.map((agent) => (
              <View
                key={agent.id}
                className="bg-gray-50 rounded-xl p-4 border border-gray-200"
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      {agent.profiles?.name || "Unknown"}
                    </Text>
                    <View className="flex-row gap-4 mt-1">
                      <Text className="text-sm text-gray-500">
                        ₦{(agent.total_earnings || 0).toLocaleString()}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {agent.completed_deliveries || 0} deliveries
                      </Text>
                    </View>
                  </View>
                  <View className="items-end gap-1">
                    <View
                      className={`px-2 py-0.5 rounded-full ${agent.is_active ? "bg-green-100" : "bg-gray-100"}`}
                    >
                      <Text
                        className={`text-xs font-semibold ${agent.is_active ? "text-green-700" : "text-gray-700"}`}
                      >
                        {agent.is_active ? "Active" : "Inactive"}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        toggleAgentStatus(agent.id, agent.is_active)
                      }
                      className="border border-gray-300 px-3 py-1 rounded-full"
                    >
                      <Text className="text-xs font-medium text-gray-700">
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
        <View className="flex-1 bg-white">
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
            <Text className="text-lg font-bold">Add Delivery Agent</Text>
            <TouchableOpacity
              onPress={() => {
                setIsAddOpen(false);
                resetForm();
              }}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <X color="#6B7280" size={16} />
            </TouchableOpacity>
          </View>

          <View className="flex-1 p-4">
            {/* Tab Toggle */}
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity
                onPress={() => setAddTab("existing")}
                className={`flex-1 py-3 rounded-xl items-center ${
                  addTab === "existing" ? "bg-blue-900" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    addTab === "existing" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Existing User
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAddTab("new")}
                className={`flex-1 py-3 rounded-xl items-center ${
                  addTab === "new" ? "bg-blue-900" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    addTab === "new" ? "text-white" : "text-gray-900"
                  }`}
                >
                  New User
                </Text>
              </TouchableOpacity>
            </View>

            {addTab === "existing" ? (
              <View className="gap-4">
                <View className="flex-row gap-2">
                  <TextInput
                    placeholder="Search by name..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSubmitEditing={searchUsers}
                    className="flex-1 h-12 px-4 rounded-xl bg-gray-100 text-gray-900"
                  />
                  <TouchableOpacity
                    onPress={searchUsers}
                    className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
                  >
                    {searchingUsers ? (
                      <ActivityIndicator size="small" color="#000080" />
                    ) : (
                      <Search color="#6B7280" size={20} />
                    )}
                  </TouchableOpacity>
                </View>

                {availableUsers.length > 0 && (
                  <View className="bg-gray-50 rounded-xl border border-gray-200 max-h-48">
                    {availableUsers.map((user) => (
                      <TouchableOpacity
                        key={user.id}
                        onPress={() => setSelectedUserId(user.id)}
                        className={`p-3 border-b border-gray-200 last:border-b-0 ${
                          selectedUserId === user.id ? "bg-blue-50" : ""
                        }`}
                      >
                        <Text className="font-medium">{user.name}</Text>
                        {user.phone && (
                          <Text className="text-sm text-gray-500">
                            {user.phone}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}

                {searchQuery && availableUsers.length === 0 && !searchingUsers && (
                  <Text className="text-sm text-gray-500 text-center py-4">
                    No users found
                  </Text>
                )}

                <TouchableOpacity
                  onPress={addExistingUserAsAgent}
                  disabled={!selectedUserId || submitting}
                  className="w-full h-12 bg-blue-900 rounded-xl items-center justify-center disabled:opacity-50"
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text className="text-white font-semibold">
                      Add Selected User as Agent
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View className="gap-4">
                <View>
                  <Text className="text-sm font-semibold text-gray-900">
                    Full Name *
                  </Text>
                  <TextInput
                    placeholder="Enter full name"
                    placeholderTextColor="#9CA3AF"
                    value={newUserName}
                    onChangeText={setNewUserName}
                    className="mt-2 w-full h-12 px-4 rounded-xl bg-gray-100 text-gray-900"
                  />
                </View>
                <View>
                  <Text className="text-sm font-semibold text-gray-900">
                    Email *
                  </Text>
                  <TextInput
                    placeholder="Enter email address"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    value={newUserEmail}
                    onChangeText={setNewUserEmail}
                    className="mt-2 w-full h-12 px-4 rounded-xl bg-gray-100 text-gray-900"
                  />
                </View>
                <View>
                  <Text className="text-sm font-semibold text-gray-900">
                    Phone (optional)
                  </Text>
                  <TextInput
                    placeholder="Enter phone number"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                    value={newUserPhone}
                    onChangeText={setNewUserPhone}
                    className="mt-2 w-full h-12 px-4 rounded-xl bg-gray-100 text-gray-900"
                  />
                </View>
                <TouchableOpacity
                  onPress={createNewAgent}
                  disabled={!newUserName || !newUserEmail || submitting}
                  className="w-full h-12 bg-blue-900 rounded-xl items-center justify-center disabled:opacity-50"
                >
                  {submitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text className="text-white font-semibold">
                      Create New Agent
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
