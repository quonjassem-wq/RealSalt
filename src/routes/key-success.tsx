import { createFileRoute, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Copy, Check, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { claimAdKey } from "@/lib/keys.functions";
import { DISCORD_URL } from "@/components/Footer";
import { getHwid } from "@/lib/hwid";

export const Route = createFileRoute("/key-success")({
  validateSearch: (s: Record<string, unknown>) => ({ token: String(s.token ?? "") }),
  head: () => ({ meta: [{ title: "Your Key — Salt" }, { name: "robots", content: "noindex" }] }),
  component: KeySuccess,
});

function KeySuccess() {
  const { token } = useSearch({ from: "/key-success" });
  const claim = useServerFn(claimAdKey);
  const [key, setKey] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) { setErr("Missing token"); return; }
    claim({ data: { token, hwid: getHwid() } }).then((r) => {
      if (r.ok) setKey(r.key); else setErr(r.error);
    }).catch((e) => setErr(e.message));
  }, [token, claim]);

  function copy() {
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="font-display text-5xl font-semibold text-gradient">Your Key</motion.h1>
      <p className="mt-3 text-sm text-muted-foreground">Valid 24 hours · locked to this device.</p>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15 }} className="glass mt-10 rounded-2xl p-8">
        {err && <p className="text-sm text-destructive">{err}</p>}
        {!err && !key && <p className="text-sm text-muted-foreground">Generating your key…</p>}
        {key && (
          <>
            <code className="block break-all rounded-lg bg-surface px-4 py-4 font-mono text-sm">{key}</code>
            <button onClick={copy}
              className="brand-gradient mt-5 inline-flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-primary-foreground">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied" : "Copy key"}
            </button>
          </>
        )}
      </motion.div>

      <a href={DISCORD_URL} target="_blank" rel="noreferrer"
        className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
        <MessageCircle className="h-3.5 w-3.5" /> Need help? Join Discord
      </a>
    </div>
  );
}
