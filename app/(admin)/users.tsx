import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow, SectionHeader, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import {
  UsersIcon,
  Package01Icon,
  Search01Icon,
  PlusSignIcon,
  CheckmarkCircle01Icon,
} from "../../src/components/icons";

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

function notifySuccess(message: string) {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  }
  toast.success(message);
}

function notifyError(message: string) {
  if (Platform.OS !== "web") {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
  }
  toast.error(message);
}

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
    const t = setTimeout(() => {
      setAgents(mockAgents);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
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
      notifySuccess("Delivery agent added");
      setIsAddOpen(false);
      resetForm();
    } catch (error: any) {
      notifyError(error.message || "Failed to add agent");
    } finally {
      setSubmitting(false);
    }
  };

  const createNewAgent = async () => {
    if (!newUserName || !newUserEmail) {
      notifyError("Name and email are required");
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
      notifySuccess("Delivery agent created");
      setIsAddOpen(false);
      resetForm();
    } catch (error: any) {
      notifyError(error.message || "Failed to create agent");
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
    notifySuccess(isActive ? "Agent deactivated" : "Agent activated");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1B1B8F" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Eyebrow>Team</Eyebrow>
            <Text className="text-[28px] font-inter-bold text-ink tracking-tight mt-1">
              Agents
            </Text>
            <Text className="text-[13px] font-inter text-ink/55 mt-1">
              Manage delivery personnel
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsAddOpen(true)}
            activeOpacity={0.85}
            className="bg-ink px-5 h-14 rounded-full flex-row items-center gap-1.5"
          >
            <Icon icon={PlusSignIcon} size={16} color="#fff" />
            <Text className="text-white font-inter-bold text-[14px]">Add Agent</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3">
          <View className="bg-white rounded-[24px] p-4 border border-border flex-1 items-center">
            <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center">
              <Icon icon={UsersIcon} size={20} color="#1B1B8F" />
            </View>
            <Text className="text-[22px] font-inter-bold text-ink mt-2">{agents.length}</Text>
            <Text className="text-[12px] font-inter text-ink/55">Total Agents</Text>
          </View>
          <View className="bg-white rounded-[24px] p-4 border border-border flex-1 items-center">
            <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center">
              <Icon icon={Package01Icon} size={20} color="#12805C" />
            </View>
            <Text className="text-[22px] font-inter-bold text-ink mt-2">
              {agents.filter((a) => a.is_active).length}
            </Text>
            <Text className="text-[12px] font-inter text-ink/55">Active</Text>
          </View>
          <View className="bg-white rounded-[24px] p-4 border border-border flex-1 items-center">
            <View className="w-11 h-11 rounded-full bg-cream border border-border items-center justify-center">
              <Icon icon={CheckmarkCircle01Icon} size={20} color="#1B1B8F" />
            </View>
            <Text className="text-[22px] font-inter-bold text-ink mt-2">
              {agents.filter((a) => a.is_online).length}
            </Text>
            <Text className="text-[12px] font-inter text-ink/55">Online Now</Text>
          </View>
        </View>

        {/* Agent list */}
        <View>
          <SectionHeader title="All agents" action={`${agents.length}`} />
          {agents.length === 0 ? (
            <View className="bg-white rounded-[24px] p-8 items-center border border-border">
              <Icon icon={UsersIcon} size={22} color="#6E6A75" />
              <Text className="text-ink/55 mt-3 font-inter-medium text-[14px] text-center">
                No delivery agents yet. Add one to get started.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {agents.map((agent) => (
                <View
                  key={agent.id}
                  className="bg-white rounded-[24px] p-5 border border-border"
                >
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-1 flex-row items-center gap-3">
                      <View className="w-12 h-12 rounded-full bg-cream border border-border items-center justify-center">
                        <Text className="text-ink font-inter-bold text-[16px]">
                          {agent.profiles?.name?.charAt(0) || "?"}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="font-inter-bold text-[15px] text-ink">
                          {agent.profiles?.name || "Unknown"}
                        </Text>
                        <View className="flex-row gap-3 mt-1">
                          <Text className="text-[12px] text-ink/55 font-inter-semibold">
                            ₦{(agent.total_earnings || 0).toLocaleString()}
                          </Text>
                          <Text className="text-[12px] font-inter text-ink/55">
                            {agent.completed_deliveries || 0} deliveries
                          </Text>
                        </View>
                        <View className="mt-2">
                          <StatusChip
                            label={agent.is_active ? "Active" : "Inactive"}
                            tone={agent.is_active ? "success" : "neutral"}
                          />
                        </View>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleAgentStatus(agent.id, agent.is_active)}
                      activeOpacity={0.85}
                      className="border border-border bg-white px-3.5 h-10 rounded-full items-center justify-center"
                    >
                      <Text className="text-[12px] font-inter-bold text-ink">
                        {agent.is_active ? "Deactivate" : "Activate"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Add agent modal */}
        <Modal
          visible={isAddOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => {
            setIsAddOpen(false);
            resetForm();
          }}
        >
          <SafeAreaView className="flex-1 bg-cream" edges={["top"]}>
            <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
              <View className="flex-1">
                <Eyebrow>Add to team</Eyebrow>
                <Text className="text-[20px] font-inter-bold text-ink tracking-tight mt-1">
                  Add delivery agent
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setIsAddOpen(false);
                  resetForm();
                }}
                activeOpacity={0.85}
                className="w-11 h-11 rounded-full bg-white border border-border items-center justify-center"
              >
                <Text className="text-ink font-inter-bold">✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1 px-5"
              contentContainerStyle={{ paddingBottom: 40, gap: 16 }}
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-row gap-2 bg-white border border-border rounded-full p-1.5">
                <TouchableOpacity
                  onPress={() => setAddTab("existing")}
                  activeOpacity={0.85}
                  className={`flex-1 h-14 rounded-full items-center justify-center ${
                    addTab === "existing" ? "bg-ink" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`font-inter-bold text-[14px] ${
                      addTab === "existing" ? "text-white" : "text-ink"
                    }`}
                  >
                    Existing User
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAddTab("new")}
                  activeOpacity={0.85}
                  className={`flex-1 h-14 rounded-full items-center justify-center ${
                    addTab === "new" ? "bg-ink" : "bg-transparent"
                  }`}
                >
                  <Text
                    className={`font-inter-bold text-[14px] ${
                      addTab === "new" ? "text-white" : "text-ink"
                    }`}
                  >
                    New User
                  </Text>
                </TouchableOpacity>
              </View>

              {addTab === "existing" ? (
                <View className="gap-4">
                  <View className="bg-white rounded-[24px] border border-border p-4">
                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <TextField
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          placeholder="Search by name..."
                          dark={false}
                        />
                      </View>
                      <TouchableOpacity
                        onPress={searchUsers}
                        activeOpacity={0.85}
                        className="w-14 h-[56px] bg-ink rounded-[20px] items-center justify-center"
                      >
                        {searchingUsers ? (
                          <ActivityIndicator size="small" color="#FFFFFF" />
                        ) : (
                          <Icon icon={Search01Icon} size={20} color="#fff" />
                        )}
                      </TouchableOpacity>
                    </View>

                    {availableUsers.length > 0 && (
                      <View className="bg-cream border border-border rounded-[20px] mt-3 overflow-hidden">
                        {availableUsers.map((u) => (
                          <TouchableOpacity
                            key={u.id}
                            onPress={() => setSelectedUserId(u.id)}
                            activeOpacity={0.85}
                            className={`p-3.5 ${
                              selectedUserId === u.id
                                ? "bg-white border border-primary rounded-[20px]"
                                : ""
                            }`}
                          >
                            <Text className="font-inter-bold text-[14px] text-ink">
                              {u.name}
                            </Text>
                            {u.phone ? (
                              <Text className="text-[13px] font-inter text-ink/55">
                                {u.phone}
                              </Text>
                            ) : null}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {searchQuery && availableUsers.length === 0 && !searchingUsers && (
                      <Text className="text-[13px] font-inter text-ink/55 text-center py-4">
                        No users found
                      </Text>
                    )}
                  </View>

                  <AppButton
                    title={submitting ? "Adding..." : "Add Selected User as Agent"}
                    variant="ink"
                    onPress={addExistingUserAsAgent}
                    loading={submitting}
                    disabled={!selectedUserId || submitting}
                  />
                </View>
              ) : (
                <View className="gap-4">
                  <View className="bg-white rounded-[24px] border border-border p-5 gap-4">
                    <TextField
                      label="Full Name *"
                      value={newUserName}
                      onChangeText={setNewUserName}
                      placeholder="Enter full name"
                      autoCapitalize="words"
                      dark={false}
                    />
                    <TextField
                      label="Email *"
                      value={newUserEmail}
                      onChangeText={setNewUserEmail}
                      placeholder="Enter email address"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      dark={false}
                    />
                    <TextField
                      label="Phone (optional)"
                      value={newUserPhone}
                      onChangeText={setNewUserPhone}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                      dark={false}
                    />
                  </View>
                  <AppButton
                    title={submitting ? "Creating..." : "Create New Agent"}
                    variant="ink"
                    onPress={createNewAgent}
                    loading={submitting}
                    disabled={!newUserName || !newUserEmail || submitting}
                  />
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
