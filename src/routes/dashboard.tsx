import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, CheckCircle2, XCircle, Loader2, Settings as SettingsIcon, User as UserIcon, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme, THEMES, type Theme } from "@/lib/theme";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { listMyKeys } from "@/lib/keys.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Salt" }] }),
  component: DashboardPage,
});

type Status =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "valid"; tier: string; expires_at: string | null }
  | { kind: "invalid"; reason: string };

function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [tab, setTab] = useState<"key" | "account" | "settings">("key");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [keyInput, setKeyInput] = useState("");
  const myKeys = useServerFn(listMyKeys);
  const [keys, setKeys] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) { navigate({ to: "/auth" }); return; }
      setUser(data.session.user);
      myKeys().then(setKeys).catch(() => {});
    });
  }, [navigate, myKeys]);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    if (!keyInput.trim()) return;
    setStatus({ kind: "checking" });
    // Lightweight client-side preview check against own keys table via RLS
    const { data } = await supabase.from("keys").select("tier, expires_at, revoked").eq("key", keyInput.trim()).maybeSingle();
    if (!data) setStatus({ kind: "invalid", reason: "Key not found or not yours" });
    else if (data.revoked) setStatus({ kind: "invalid", reason: "Key revoked" });
    else if (data.expires_at && new Date(data.expires_at) < new Date()) setStatus({ kind: "invalid", reason: "Key expired" });
    else setStatus({ kind: "valid", tier: data.tier, expires_at: data.expires_at });
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  if (!user) return <div className="px-6 py-20 text-center text-sm text-muted-foreground">Loading…</div>;

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-5xl font-semibold text-gradient">Dashboard</motion.h1>
      <p className="mt-3 text-center text-sm text-muted-foreground">Signed in as {user.email}</p>

      <div className="mt-10 flex items-center justify-center gap-1 rounded-full border border-border bg-surface p-1">
        {([
          { id: "key" as const, label: "Keys", icon: KeyRound },
          { id: "account" as const, label: "Account", icon: UserIcon },
          { id: "settings" as const, label: "Settings", icon: SettingsIcon },
        ]).map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="relative inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-colors text-muted-foreground hover:text-foreground">
              {active && <motion.span layoutId="dash-tab" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
              <span className={`relative inline-flex items-center gap-1.5 ${active ? "text-foreground" : ""}`}>
                <t.icon className="h-3.5 w-3.5" />{t.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, x: 16, filter: "blur(6px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, x: -16, filter: "blur(6px)" }} transition={{ duration: 0.28 }} className="mt-8 space-y-6">
          {tab === "key" && (
            <>
              <div className="glass rounded-2xl p-8">
                <form onSubmit={check} className="flex flex-col gap-3 sm:flex-row">
                  <input value={keyInput} onChange={(e) => setKeyInput(e.target.value)} placeholder="SALT-XXXX-XXXX-XXXX"
                    className="flex-1 rounded-xl border border-border bg-input px-4 py-3 font-mono text-sm outline-none focus:ring-2 focus:ring-brand-glow/40" />
                  <button type="submit" disabled={status.kind === "checking"}
                    className="brand-gradient inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
                    {status.kind === "checking" ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Check
                  </button>
                </form>
                <AnimatePresence>
                  {status.kind === "valid" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-6 flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-success" />
                      <div>
                        <div className="font-medium text-success">Key is valid</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{status.tier} · {status.expires_at ? "expires " + new Date(status.expires_at).toLocaleString() : "permanent"}</div>
                      </div>
                    </motion.div>
                  )}
                  {status.kind === "invalid" && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="mt-6 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4">
                      <XCircle className="mt-0.5 h-5 w-5 text-destructive" />
                      <div><div className="font-medium text-destructive">Invalid</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">{status.reason}</div></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display text-lg font-semibold">Your keys</h3>
                {keys.length === 0 ? (
                  <p className="mt-3 text-sm text-muted-foreground">No keys linked yet. Use the same email and HWID with the executor to bind keys.</p>
                ) : (
                  <ul className="mt-4 space-y-2">
                    {keys.map((k) => (
                      <li key={k.key} className="flex items-center justify-between rounded-lg bg-surface px-3 py-2 font-mono text-xs">
                        <span>{k.key}</span>
                        <span className="text-muted-foreground">{k.tier} · {k.expires_at ? new Date(k.expires_at).toLocaleDateString() : "perm"}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
          {tab === "account" && (
            <div className="glass rounded-2xl p-8">
              <h3 className="font-display text-xl font-semibold">Account</h3>
              <p className="mt-2 text-sm text-muted-foreground">Email: {user.email}</p>
              <button onClick={signOut} className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm hover:bg-accent">
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          )}
          {tab === "settings" && <SettingsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SettingsTab() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="glass rounded-2xl p-8">
      <h3 className="font-display text-xl font-semibold">Theme</h3>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {THEMES.map((t) => (
          <button key={t.id} onClick={() => setTheme(t.id as Theme)}
            className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${theme === t.id ? "border-brand-glow/60 bg-accent" : "border-border hover:bg-accent/40"}`}>
            <div className="flex h-9 w-14 overflow-hidden rounded-md ring-1 ring-inset ring-border/50">
              {t.swatch.map((c) => <span key={c} className="h-full flex-1" style={{ background: c }} />)}
            </div>
            <div className="text-sm font-medium">{t.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
