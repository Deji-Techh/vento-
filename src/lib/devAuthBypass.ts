// ─── DEV-ONLY AUTH BYPASS ─────────────────────────────────────────────
// Purpose: let ANY email/password work in sign-in / sign-up for dev testing.
//
// TO REMOVE (one step): set DEV_AUTH_BYPASS to false, or delete this file
// and the blocks marked `DEV-BYPASS` in:
//   - src/contexts/AuthContext.tsx  (signIn + signUp)
//   - app/auth/login.tsx            (role routing)
// ─────────────────────────────────────────────────────────────────────

export const DEV_AUTH_BYPASS = true;

export type DevRole = "admin" | "seller" | "buyer" | "delivery_agent";

/** Role inference for dev testing: match by email keyword, default buyer. */
export function inferDevRole(email: string): DevRole {
  const e = email.toLowerCase();
  if (e.includes("admin")) return "admin";
  if (e.includes("seller") || e.includes("chef") || e.includes("kitchen") || e.includes("ada")) return "seller";
  if (e.includes("rider") || e.includes("deliver") || e.includes("driver") || e.includes("emeka")) return "delivery_agent";
  return "buyer";
}

const ROLE_IDS: Record<DevRole, string> = {
  admin: "mock-admin-001",
  seller: "mock-seller-001",
  buyer: "mock-buyer-001",
  delivery_agent: "mock-agent-001",
};

/** Build a local dev session — no network, no password check. */
export function makeDevSession(email: string, name?: string) {
  const role = inferDevRole(email);
  return {
    userData: { id: ROLE_IDS[role], email },
    role,
    profile: {
      id: ROLE_IDS[role],
      name: name || email.split("@")[0],
      email,
      phone: null,
      avatar_url: null,
      role,
    },
  };
}
