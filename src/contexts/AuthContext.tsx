import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, SUPABASE_CONFIGURED } from "../lib/supabase";
import { registerPush } from "../lib/push";
import { markOnboardingSeen } from "../lib/firstRun";

export type Role = "buyer" | "seller" | "delivery_agent" | "admin";

interface Profile {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: Role;
  avatar_url: string | null;
}

interface AuthContextType {
  user: { id: string; email: string } | null;
  profile: Profile | null;
  role: Role | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<Role>;
  signUp: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function friendly(error: any): string {
  const msg = error?.message || "";
  if (/invalid login credentials/i.test(msg)) return "Wrong email or password";
  if (/user already registered|already exists/i.test(msg)) return "Account exists — log in instead";
  if (/password should be/i.test(msg)) return msg;
  if (/network|fetch|connection/i.test(msg)) return "Check your connection and try again";
  return msg || "Something went wrong";
}

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
  if (error) return null;
  return data as Profile;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!alive) return;
        const session = data.session;
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || "" });
          const p = await fetchProfile(session.user.id);
          if (!alive) return;
          setProfile(p);
          setRole(p?.role || "buyer");
          registerPush(session.user.id);
        }
        setLoading(false);
      })
      .catch(() => {
        if (alive) setLoading(false);
      });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!alive) return;
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || "" });
        const p = await fetchProfile(session.user.id);
        if (!alive) return;
        setProfile(p);
        setRole(p?.role || "buyer");
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<Role> => {
    if (!SUPABASE_CONFIGURED) throw new Error("Backend not connected — try again later");
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(friendly(error));
    const p = data.user ? await fetchProfile(data.user.id) : null;
    const r = p?.role || "buyer";
    if (data.user) setUser({ id: data.user.id, email: data.user.email || "" });
    setProfile(p);
    setRole(r);
    markOnboardingSeen();
    if (data.user) registerPush(data.user.id);
    return r;
  };

  const signUp = async (data: { email: string; password: string; firstName: string; lastName: string }) => {
    if (!SUPABASE_CONFIGURED) throw new Error("Backend not connected — try again later");
    const name = `${data.firstName} ${data.lastName}`.trim();
    const { data: res, error } = await supabase.auth.signUp({
      email: data.email.trim().toLowerCase(),
      password: data.password,
      options: { data: { name, role: "buyer" } },
    });
    if (error) throw new Error(friendly(error));
    if (res.user && !res.session) {
      throw new Error("Check your email to confirm your account");
    }
    // Ensure a profile row exists even if the trigger lags.
    if (res.user) {
      const existing = await fetchProfile(res.user.id);
      if (!existing) {
        await supabase.from("profiles").insert({
          id: res.user.id,
          email: data.email.trim().toLowerCase(),
          name,
          role: "buyer",
        });
      }
    }
    markOnboardingSeen();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRole(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const p = await fetchProfile(user.id);
      setProfile(p);
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
