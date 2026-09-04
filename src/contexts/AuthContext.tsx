import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MockUser {
  id: string;
  email: string;
  [key: string]: any;
}

interface AuthContextType {
  user: MockUser | null;
  profile: any | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_PROFILES: Record<string, any> = {
  "mock-admin-001": {
    id: "mock-admin-001",
    name: "Admin User",
    email: "admin@campus.edu",
    phone: "+2348000000001",
    avatar_url: null,
    role: "admin",
  },
  "mock-seller-001": {
    id: "mock-seller-001",
    name: "Chef Ada",
    email: "ada@campus.edu",
    phone: "+2348000000002",
    avatar_url: null,
    role: "seller",
    sellers: {
      id: "seller-001",
      store_name: "Ada's Kitchen",
      description: "Authentic Nigerian cuisine",
      total_earnings: 125000,
      completed_deliveries: 0,
      approved: true,
      verification_status: "verified",
    },
  },
  "mock-buyer-001": {
    id: "mock-buyer-001",
    name: "Chidi Okonkwo",
    email: "chidi@campus.edu",
    phone: "+2348000000003",
    avatar_url: null,
    role: "buyer",
  },
  "mock-agent-001": {
    id: "mock-agent-001",
    name: "Emeka Rider",
    email: "emeka@campus.edu",
    phone: "+2348000000004",
    avatar_url: null,
    role: "delivery_agent",
    delivery_agents: {
      id: "agent-001",
      is_active: true,
      is_online: false,
      total_earnings: 45000,
      completed_deliveries: 23,
    },
  },
};

const MOCK_USERS: Record<string, { id: string; role: string }> = {
  "admin@campus.edu": { id: "mock-admin-001", role: "admin" },
  "ada@campus.edu": { id: "mock-seller-001", role: "seller" },
  "chidi@campus.edu": { id: "mock-buyer-001", role: "buyer" },
  "emeka@campus.edu": { id: "mock-agent-001", role: "delivery_agent" },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("mock_user");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          const p = MOCK_PROFILES[parsed.id];
          setProfile(p || null);
          setRole(p?.role || null);
        }
      } catch (e) {
        console.error("Failed to load user", e);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signIn = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 1000));
    const mockUser = MOCK_USERS[email.toLowerCase()];
    const id = mockUser?.id || `mock-user-${Date.now()}`;
    const userData = { id, email };
    await AsyncStorage.setItem("mock_user", JSON.stringify(userData));
    setUser(userData);
    const p = MOCK_PROFILES[id];
    setProfile(p || null);
    setRole(p?.role || "buyer");
  };

  const signUp = async (data: any) => {
    await new Promise((r) => setTimeout(r, 1000));
    const id = `mock-user-${Date.now()}`;
    const userData = { id, email: data.email };
    await AsyncStorage.setItem("mock_user", JSON.stringify(userData));
    setUser(userData);
    setProfile({
      id,
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      phone: data.phone || null,
      avatar_url: null,
      role: "buyer",
    });
    setRole("buyer");
  };

  const signOut = async () => {
    await AsyncStorage.removeItem("mock_user");
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = MOCK_PROFILES[user.id];
      setProfile(p || null);
      setRole(p?.role || null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, role, loading, signIn, signUp, signOut, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
