import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Ban } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/banned")({
  head: () => ({ meta: [{ title: "Banned — Salt" }, { name: "robots", content: "noindex" }] }),
  component: BannedPage,
});

function BannedPage() {
  const [info, setInfo] = useState<{ reason: string; expires_at: string | null; banned_at: string } | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("salt.ban");
      if (raw) setInfo(JSON.parse(raw));
    } catch {}
  }, []);
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 180, damping: 18 }}
        className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/20 text-destructive">
        <Ban className="h-10 w-10" />
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="mt-8 font-display text-4xl font-semibold text-destructive">You're banned</motion.h1>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="mt-3 text-sm text-muted-foreground">
        Your HWID or IP has been banned from accessing Salt.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="glass mt-8 w-full rounded-xl p-5 text-left">
        <Row k="Reason" v={info?.reason ?? "—"} />
        <Row k="Banned at" v={info?.banned_at ? new Date(info.banned_at).toLocaleString() : "—"} />
        <Row k="Until" v={info?.expires_at ? new Date(info.expires_at).toLocaleString() : "Permanent"} />
        <Row k="Appeal" v="Discord ticket" />
      </motion.div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-2 last:border-0">
      <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{k}</span>
      <span className="text-sm font-medium">{v}</span>
    </div>
  );
}
