import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "framer-motion";
import { Trash2, Plus, Copy, ShieldOff, ShieldCheck } from "lucide-react";
import { getMyRole } from "@/lib/keys.functions";
import {
  adminListKeys, adminGenerateKey, adminRevokeKey,
  adminListBans, adminAddBan, adminRemoveBan,
  adminListLogs, adminListUsers, adminTogglePromote,
} from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin — Salt" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

type Tab = "keys" | "bans" | "logs" | "users";

function Admin() {
  const navigate = useNavigate();
  const role = useServerFn(getMyRole);
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("keys");

  useEffect(() => {
    role().then((r) => {
      if (!r.isAdmin) { navigate({ to: "/dashboard" }); return; }
      setAllowed(true);
    }).catch(() => navigate({ to: "/dashboard" }));
  }, [role, navigate]);

  if (!allowed) return <div className="px-6 py-20 text-center text-sm text-muted-foreground">Checking access…</div>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="font-display text-4xl font-semibold text-gradient">Admin Panel</motion.h1>
      <div className="mt-6 flex gap-1 rounded-lg bg-surface p-1 text-xs font-medium w-fit">
        {(["keys", "bans", "logs", "users"] as Tab[]).map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-md px-4 py-2 capitalize transition-colors ${tab === t ? "brand-gradient text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="mt-6">
        {tab === "keys" && <KeysTab />}
        {tab === "bans" && <BansTab />}
        {tab === "logs" && <LogsTab />}
        {tab === "users" && <UsersTab />}
      </div>
    </div>
  );
}

function KeysTab() {
  const list = useServerFn(adminListKeys);
  const gen = useServerFn(adminGenerateKey);
  const revoke = useServerFn(adminRevokeKey);
  const [rows, setRows] = useState<any[]>([]);
  const [tier, setTier] = useState<"24h" | "week" | "month" | "perm">("week");
  const [count, setCount] = useState(1);
  function refresh() { list().then(setRows); }
  useEffect(() => { refresh(); }, []);
  return (
    <div className="space-y-4">
      <div className="glass flex flex-wrap items-end gap-3 rounded-xl p-4">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground">Tier</label>
          <select value={tier} onChange={(e) => setTier(e.target.value as any)} className="mt-1 rounded-md bg-surface px-3 py-2 text-sm">
            <option value="24h">24h</option><option value="week">Week</option><option value="month">Month</option><option value="perm">Permanent</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-muted-foreground">Count</label>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(+e.target.value)}
            className="mt-1 w-24 rounded-md bg-surface px-3 py-2 text-sm" />
        </div>
        <button onClick={() => gen({ data: { tier, count } }).then(refresh)}
          className="brand-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground">
          <Plus className="h-4 w-4" /> Generate
        </button>
      </div>
      <div className="glass rounded-xl">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-3 text-left">Key</th><th className="p-3">Tier</th><th className="p-3">HWID</th><th className="p-3">Expires</th><th className="p-3">State</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-border/40">
                <td className="p-3 font-mono text-xs">
                  <button onClick={() => navigator.clipboard.writeText(r.key)} className="inline-flex items-center gap-1.5 hover:text-foreground">
                    <Copy className="h-3 w-3" /> {r.key}
                  </button>
                </td>
                <td className="p-3 text-center">{r.tier}</td>
                <td className="p-3 text-center text-xs text-muted-foreground">{r.hwid?.slice(0, 12) ?? "—"}</td>
                <td className="p-3 text-center text-xs">{r.expires_at ? new Date(r.expires_at).toLocaleDateString() : "Never"}</td>
                <td className="p-3 text-center">{r.revoked ? <span className="text-destructive">revoked</span> : <span className="text-success">active</span>}</td>
                <td className="p-3 text-right">
                  {!r.revoked && (
                    <button onClick={() => revoke({ data: { key: r.key } }).then(refresh)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="p-6 text-center text-sm text-muted-foreground">No keys yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function BansTab() {
  const list = useServerFn(adminListBans);
  const add = useServerFn(adminAddBan);
  const remove = useServerFn(adminRemoveBan);
  const [rows, setRows] = useState<any[]>([]);
  const [type, setType] = useState<"ip" | "hwid">("ip");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  function refresh() { list().then(setRows); }
  useEffect(() => { refresh(); }, []);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    await add({ data: { type, value, reason } });
    setValue(""); setReason(""); refresh();
  }
  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="glass flex flex-wrap gap-3 rounded-xl p-4">
        <select value={type} onChange={(e) => setType(e.target.value as any)} className="rounded-md bg-surface px-3 py-2 text-sm">
          <option value="ip">IP</option><option value="hwid">HWID</option>
        </select>
        <input value={value} onChange={(e) => setValue(e.target.value)} placeholder="value" className="flex-1 rounded-md bg-surface px-3 py-2 text-sm" />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="reason" className="flex-1 rounded-md bg-surface px-3 py-2 text-sm" />
        <button className="brand-gradient rounded-lg px-4 py-2 text-sm font-semibold text-primary-foreground">Ban</button>
      </form>
      <div className="glass rounded-xl">
        <table className="w-full text-sm">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="p-3 text-left">Type</th><th className="p-3 text-left">Value</th><th className="p-3 text-left">Reason</th><th className="p-3">When</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map((b) => (
              <tr key={b.id} className="border-t border-border/40">
                <td className="p-3 uppercase text-xs">{b.type}</td>
                <td className="p-3 font-mono text-xs">{b.value}</td>
                <td className="p-3 text-xs">{b.reason}</td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(b.banned_at).toLocaleString()}</td>
                <td className="p-3 text-right">
                  <button onClick={() => remove({ data: { id: b.id } }).then(refresh)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-sm text-muted-foreground">No bans</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LogsTab() {
  const list = useServerFn(adminListLogs);
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => { list().then(setRows); }, []);
  return (
    <div className="glass rounded-xl">
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr><th className="p-3 text-left">When</th><th className="p-3 text-left">IP</th><th className="p-3 text-left">HWID</th><th className="p-3 text-left">Path</th></tr>
        </thead>
        <tbody>
          {rows.map((l) => (
            <tr key={l.id} className="border-t border-border/40">
              <td className="p-3 text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString()}</td>
              <td className="p-3 font-mono text-xs">{l.ip}</td>
              <td className="p-3 font-mono text-xs">{l.hwid?.slice(0, 16) ?? "—"}</td>
              <td className="p-3 text-xs">{l.path}</td>
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-sm text-muted-foreground">No logs yet</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function UsersTab() {
  const list = useServerFn(adminListUsers);
  const toggle = useServerFn(adminTogglePromote);
  const [rows, setRows] = useState<any[]>([]);
  function refresh() { list().then(setRows); }
  useEffect(() => { refresh(); }, []);
  return (
    <div className="glass rounded-xl">
      <table className="w-full text-sm">
        <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
          <tr><th className="p-3 text-left">User</th><th className="p-3 text-left">Roles</th><th className="p-3">Joined</th><th></th></tr>
        </thead>
        <tbody>
          {rows.map((u) => {
            const isAdmin = u.roles.includes("admin");
            return (
              <tr key={u.id} className="border-t border-border/40">
                <td className="p-3">{u.username ?? u.id.slice(0, 8)}</td>
                <td className="p-3 text-xs">{u.roles.join(", ") || "user"}</td>
                <td className="p-3 text-xs text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="p-3 text-right">
                  <button onClick={() => toggle({ data: { user_id: u.id, make_admin: !isAdmin } }).then(refresh)}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs hover:bg-accent">
                    {isAdmin ? <><ShieldOff className="h-3 w-3" /> Demote</> : <><ShieldCheck className="h-3 w-3" /> Promote</>}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
