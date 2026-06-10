import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// User-facing: list current user's keys
export const listMyKeys = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("keys")
      .select("key, tier, expires_at, revoked, source, created_at, first_used_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });

// Check ban status for the current visitor (by ip / hwid fingerprint provided client-side)
export const checkBanStatus = createServerFn({ method: "POST" })
  .inputValidator((d: { hwid?: string }) => d ?? {})
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getRequestIP, getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() || getRequestIP({ xForwardedFor: true }) || "";
    const values: { type: "ip" | "hwid"; value: string }[] = [];
    if (ip) values.push({ type: "ip", value: ip });
    if (data.hwid) values.push({ type: "hwid", value: data.hwid });
    if (values.length === 0) return { banned: false as const };
    const { data: bans } = await supabaseAdmin
      .from("bans")
      .select("reason, expires_at, banned_at, type, value")
      .or(values.map((v) => `and(type.eq.${v.type},value.eq.${v.value})`).join(","))
      .limit(1);
    const active = (bans ?? []).find((b) => !b.expires_at || new Date(b.expires_at) > new Date());
    if (!active) return { banned: false as const };
    return { banned: true as const, reason: active.reason, expires_at: active.expires_at, banned_at: active.banned_at };
  });

// Start an ad-gateway session and return the token + a placeholder gateway URL.
export const startAdSession = createServerFn({ method: "POST" })
  .inputValidator((d: { gateway: "linkvertise" | "lootlabs"; hwid?: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getRequestIP, getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() || getRequestIP({ xForwardedFor: true }) || "";
    const token = crypto.randomUUID().replace(/-/g, "") + crypto.randomUUID().replace(/-/g, "");
    const { error } = await supabaseAdmin.from("ad_sessions").insert({ token, ip, hwid: data.hwid ?? null });
    if (error) throw new Error(error.message);
    // Placeholder gateway URL — wire your Linkvertise/Lootlabs target URL here.
    const returnUrl = `/key-success?token=${token}`;
    return { token, returnUrl, gateway: data.gateway };
  });

// Claim the ad token and issue a 24h key bound to the visitor.
export const claimAdKey = createServerFn({ method: "POST" })
  .inputValidator((d: { token: string; hwid?: string }) => d)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getRequestIP, getRequestHeader } = await import("@tanstack/react-start/server");
    const ip = getRequestHeader("cf-connecting-ip") || getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() || getRequestIP({ xForwardedFor: true }) || "";

    const { data: session } = await supabaseAdmin.from("ad_sessions").select("*").eq("token", data.token).maybeSingle();
    if (!session) return { ok: false as const, error: "Invalid or expired token" };
    if (session.consumed_at && session.key_issued) {
      return { ok: true as const, key: session.key_issued, tier: "24h" as const };
    }
    const newKey = "SALT-" + Array.from(crypto.getRandomValues(new Uint8Array(12))).map((b) => b.toString(36).padStart(2, "0")).join("").toUpperCase().slice(0, 24);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    const { error } = await supabaseAdmin.from("keys").insert({
      key: newKey, tier: "24h", source: "ad", hwid: data.hwid ?? session.hwid ?? null, ip: ip || session.ip, expires_at: expiresAt,
    });
    if (error) return { ok: false as const, error: error.message };
    await supabaseAdmin.from("ad_sessions").update({ consumed_at: new Date().toISOString(), key_issued: newKey, hwid: data.hwid ?? session.hwid }).eq("token", data.token);
    return { ok: true as const, key: newKey, tier: "24h" as const, expires_at: expiresAt };
  });

// Whether the current user is admin
export const getMyRole = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.from("user_roles").select("role").eq("user_id", context.userId);
    const roles = (data ?? []).map((r) => r.role);
    return { isAdmin: roles.includes("admin"), roles };
  });
