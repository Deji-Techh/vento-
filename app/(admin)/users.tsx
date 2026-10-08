import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { toast } from "sonner-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { supabase } from "../../src/lib/supabase";
import { buzz } from "../../src/lib/haptics";
import { AppButton } from "../../src/components/ui/AppButton";
import { TextField } from "../../src/components/ui/TextField";
import { Eyebrow, SectionHeader, StatusChip } from "../../src/components/ui/SectionHeader";
import { Icon } from "../../src/components/ui/Icon";
import { useTheme } from "../../src/contexts/ThemeContext";
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
  const { dark } = useTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPhone, setNewUserPhone] = useState("");

  const load = useCallback(async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("id, name, phone, role, created_at").eq("role", "delivery_agent").order("created_at", { ascending: false }).limit(100);
      if (error) throw error;
      const ids = (data || []).map((a: any) => a.id);
      let counts: Record<string, number> = {};
      if (ids.length > 0) {
        const { data: d } = await supabase.from("deliveries").select("agent_id").in("agent_id", ids).eq("status", "delivered");
        for (const row of (d || []) as any[]) counts[row.agent_id] = (counts[row.agent_id] || 0) + 1;
      }
      setAgents((data || []).map((a: any) => ({ id: a.id, is_active: true, is_online: false, total_earnings: 0, completed_deliveries: counts[a.id] || 0, created_at: a.created_at, profiles: { name: a.name, phone: a.phone } })));
    } catch (e: any) {
      toast.error(e.message || "Couldn't load agents");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const searchUsers = async () => {
    if (!searchQuery.trim()) return;
    setSearchingUsers(true);
    try {
      const { data, error } = await supabase.from("profiles").select("id, name, phone, role").or(`name.ilike.%${searchQuery.trim()}%,email.ilike.%${searchQuery.trim()}%`).neq("role", "delivery_agent").limit(10);
      if (error) throw error;
      setAvailableUsers((data as any) || []);
    } catch (e: any) {
      toast.error(e.message || "Search failed");
    } finally {
      setSearchingUsers(false);
    }
  };

  const addExistingUserAsAgent = async () => {
    if (!selectedUserId) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from("profiles").update({ role: "delivery_agent" }).eq("id", selectedUserId);
      if (error) throw error;
      if (user) await supabase.from("admin_actions").insert({ admin_id: user.id, action_type: "rider_promoted", target_id: selectedUserId, meta: {} });
      notifySuccess("Delivery agent added");
      setIsAddOpen(false);
      resetForm();
      load();
    } catch (error: any) {
      notifyError(error.message || "Failed to add agent");
    } finally {
      setSubmitting(false);
    }
  };

  const createNewAgent = async () => {
    notifyError("Create auth users in Supabase Dashboard → Auth → Add user, then promote here");
  };

  const resetForm = () => {
    setSearchQuery("");
    setAvailableUsers([]);
    setSelectedUserId(null);
    setNewUserName("");
    setNewUserEmail("");
    setNewUserPhone("");
  };

  const toggleAgentStatus = async (agentId: string, isActive: boolean) => {
    try {
      // No is_active column: demote back to buyer to deactivate, restore to promote.
      const { error } = await supabase.from("profiles").update({ role: isActive ? "buyer" : "delivery_agent" }).eq("id", agentId);
      if (error) throw error;
      if (user) await supabase.from("admin_actions").insert({ admin_id: user.id, action_type: isActive ? "rider_demoted" : "rider_promoted", target_id: agentId, meta: {} });
      notifySuccess(isActive ? "Agent deactivated" : "Agent activated");
      load();
    } catch (e: any) {
      notifyError(e.message || "Couldn't update agent");
    }
  };

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={dark ? "#FFFFFF" : "#0A0A0E"} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 12, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between gap-3">
          <View className="flex-1">
            <Eyebrow>Team</Eyebrow>
            <Text className={`text-[28px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>
              Agents
            </Text>
            <Text className={`text-[13px] font-inter mt-1 ${dark ? "text-white/55" : "text-ink/55"}`}>
              Manage delivery personnel
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsAddOpen(true)}
            activeOpacity={0.85}
            className={`px-5 h-14 rounded-full flex-row items-center gap-1.5 ${dark ? "bg-white" : "bg-ink"}`}
          >
            <Icon icon={PlusSignIcon} size={16} color={dark ? "#0A0A0E" : "#fff"} />
            <Text className={`font-inter-bold text-[14px] ${dark ? "text-ink" : "text-white"}`}>Add Agent</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row gap-3">
          <View className={`rounded-[24px] p-4 border flex-1 items-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={UsersIcon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
            </View>
            <Text className={`text-[22px] font-inter-bold mt-2 ${dark ? "text-white" : "text-ink"}`}>{agents.length}</Text>
            <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Total Agents</Text>
          </View>
          <View className={`rounded-[24px] p-4 border flex-1 items-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={Package01Icon} size={20} color="#12805C" />
            </View>
            <Text className={`text-[22px] font-inter-bold mt-2 ${dark ? "text-white" : "text-ink"}`}>
              {agents.filter((a) => a.is_active).length}
            </Text>
            <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Active</Text>
          </View>
          <View className={`rounded-[24px] p-4 border flex-1 items-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
            <View className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
              <Icon icon={CheckmarkCircle01Icon} size={20} color={dark ? "#fff" : "#0A0A0E"} />
            </View>
            <Text className={`text-[22px] font-inter-bold mt-2 ${dark ? "text-white" : "text-ink"}`}>
              {agents.filter((a) => a.is_online).length}
            </Text>
            <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Online Now</Text>
          </View>
        </View>

        {/* Agent list */}
        <View>
          <SectionHeader title="All agents" action={`${agents.length}`} />
          {agents.length === 0 ? (
            <View className={`rounded-[24px] p-8 items-center border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
              <Icon icon={UsersIcon} size={22} color={dark ? "rgba(255,255,255,0.6)" : "#6E6A75"} />
              <Text className={`mt-3 font-inter-medium text-[14px] text-center ${dark ? "text-white/55" : "text-ink/55"}`}>
                No delivery agents yet. Add one to get started.
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {agents.map((agent) => (
                <View
                  key={agent.id}
                  className={`rounded-[24px] p-5 border ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
                >
                  <View className="flex-row items-center justify-between gap-3">
                    <View className="flex-1 flex-row items-center gap-3">
                      <View className={`w-12 h-12 rounded-full border items-center justify-center ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                        <Text className={`font-inter-bold text-[16px] ${dark ? "text-white" : "text-ink"}`}>
                          {agent.profiles?.name?.charAt(0) || "?"}
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className={`font-inter-bold text-[15px] ${dark ? "text-white" : "text-ink"}`}>
                          {agent.profiles?.name || "Unknown"}
                        </Text>
                        <View className="flex-row gap-3 mt-1">
                          <Text className={`text-[12px] font-inter-semibold ${dark ? "text-white/55" : "text-ink/55"}`}>
                            ₦{(agent.total_earnings || 0).toLocaleString()}
                          </Text>
                          <Text className={`text-[12px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
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
                      className={`border px-3.5 h-10 rounded-full items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
                    >
                      <Text className={`text-[12px] font-inter-bold ${dark ? "text-white" : "text-ink"}`}>
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
          <SafeAreaView className={`flex-1 ${dark ? "bg-ink" : "bg-cream"}`} edges={["top"]}>
            <View className="flex-row items-center justify-between px-5 pt-4 pb-3">
              <View className="flex-1">
                <Eyebrow>Add to team</Eyebrow>
                <Text className={`text-[20px] font-inter-bold tracking-tight mt-1 ${dark ? "text-white" : "text-ink"}`}>
                  Add delivery agent
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setIsAddOpen(false);
                  resetForm();
                }}
                activeOpacity={0.85}
                className={`w-11 h-11 rounded-full border items-center justify-center ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}
              >
                <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              className="flex-1 px-5"
              contentContainerStyle={{ paddingBottom: 40, gap: 16 }}
              showsVerticalScrollIndicator={false}
            >
              <Text className={`text-[13px] font-inter px-1 ${dark ? "text-white/55" : "text-ink/55"}`}>Search a signed-up user, then promote to delivery agent. New accounts are created in Supabase Dashboard → Auth → Add user.</Text>

              {true ? (
                <View className="gap-4">
                  <View className={`rounded-[24px] border p-4 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                    <View className="flex-row gap-2">
                      <View className="flex-1">
                        <TextField
                          value={searchQuery}
                          onChangeText={setSearchQuery}
                          placeholder="Search by name..."
                        />
                      </View>
                      <TouchableOpacity
                        onPress={searchUsers}
                        activeOpacity={0.85}
                        className={`w-14 h-[56px] rounded-[20px] items-center justify-center ${dark ? "bg-white" : "bg-ink"}`}
                      >
                        {searchingUsers ? (
                          <ActivityIndicator size="small" color={dark ? "#0A0A0E" : "#FFFFFF"} />
                        ) : (
                          <Icon icon={Search01Icon} size={20} color={dark ? "#0A0A0E" : "#fff"} />
                        )}
                      </TouchableOpacity>
                    </View>

                    {availableUsers.length > 0 && (
                      <View className={`border rounded-[20px] mt-3 overflow-hidden ${dark ? "bg-white/10 border-white/10" : "bg-cream border-border"}`}>
                        {availableUsers.map((u) => (
                          <TouchableOpacity
                            key={u.id}
                            onPress={() => setSelectedUserId(u.id)}
                            activeOpacity={0.85}
                            className={`p-3.5 ${
                              selectedUserId === u.id
                                ? dark
                                  ? "bg-white/10 border border-white/20 rounded-[20px]"
                                  : "bg-white border border-ink rounded-[20px]"
                                : ""
                            }`}
                          >
                            <Text className={`font-inter-bold text-[14px] ${dark ? "text-white" : "text-ink"}`}>
                              {u.name}
                            </Text>
                            {u.phone ? (
                              <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>
                                {u.phone}
                              </Text>
                            ) : null}
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {searchQuery && availableUsers.length === 0 && !searchingUsers && (
                      <Text className={`text-[13px] font-inter text-center py-4 ${dark ? "text-white/55" : "text-ink/55"}`}>
                        No users found
                      </Text>
                    )}
                  </View>

                  <AppButton
                    title={submitting ? "Adding..." : "Add Selected User as Agent"}
                    variant={dark ? "white" : "ink"}
                    onPress={addExistingUserAsAgent}
                    loading={submitting}
                    disabled={!selectedUserId || submitting}
                  />
                </View>
              ) : (
                <View className="gap-4">
                  <View className={`rounded-[24px] border p-5 gap-2 ${dark ? "bg-white/[0.06] border-white/10" : "bg-white border-border"}`}>
                    <Text className={`font-inter-bold ${dark ? "text-white" : "text-ink"}`}>New accounts</Text>
                    <Text className={`text-[13px] font-inter ${dark ? "text-white/55" : "text-ink/55"}`}>Create the auth user in Supabase Dashboard → Auth → Add user. They'll appear in search above — then promote.</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}
