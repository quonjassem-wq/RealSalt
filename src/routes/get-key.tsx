import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, MessageCircle, ExternalLink, Loader2 } from "lucide-react";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { DISCORD_URL } from "@/components/Footer";
import { startAdSession } from "@/lib/keys.functions";
import { getHwid } from "@/lib/hwid";

export const Route = createFileRoute("/get-key")({
  head: () => ({
    meta: [
      { title: "Get Key — Salt" },
      { name: "description", content: "Get your Salt key via Linkvertise or Lootlabs." },
    ],
  }),
  component: GetKeyPage,
});

const PRICES = [
  { name: "1 Day", price: "Ads", note: "Free with ad gateway", popular: false },
  { name: "1 Week", price: "$2.99", note: "Ad-free, full features", popular: true },
  { name: "30 Days", price: "$9.99", note: "Best value monthly", popular: false },
  { name: "Permanent", price: "$14.99", note: "One-time, lifetime", popular: false },
];

function GetKeyPage() {
  const [showSoon, setShowSoon] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  const startSession = useServerFn(startAdSession);

  async function startGateway(gateway: "linkvertise" | "lootlabs") {
    setLoading(gateway);
    try {
      const r = await startSession({ data: { gateway, hwid: getHwid() } });
      // Placeholder: real Linkvertise/Lootlabs URL would be inserted here.
      // For now, jump straight to the return URL so the flow works end-to-end.
      navigate({ to: "/key-success", search: { token: r.token } });
    } catch (e) {
      setLoading(null);
      setShowSoon(true);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <div className="text-center">
        <motion.img
          src={logo.url} alt="Salt"
          className="mx-auto h-16 w-16 rounded-xl no-select" draggable={false}
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
        />
        <motion.h1
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 font-display text-5xl font-semibold text-gradient"
        >
          Get Your Key
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          className="mt-3 text-sm text-muted-foreground"
        >
          Free 24-hour key via an ad gateway. Locked to 1 HWID.
        </motion.p>
      </div>

      {/* Free gateway picker */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-12 grid gap-4 sm:grid-cols-2"
      >
        {[
          { name: "Linkvertise", desc: "Faster gateway, fewer clicks." },
          { name: "Lootlabs", desc: "Alternate gateway if Linkvertise fails." },
        ].map((g, i) => (
          <motion.button
            key={g.name}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            onClick={() => startGateway(g.name.toLowerCase() as "linkvertise" | "lootlabs")}
            disabled={loading !== null}
            className="glass group flex items-center justify-between rounded-2xl p-6 text-left disabled:opacity-60"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div>
              <div className="font-display text-lg font-semibold">{g.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">{g.desc}</div>
            </div>
            {loading === g.name.toLowerCase() ? <Loader2 className="h-5 w-5 animate-spin" /> :
              <ExternalLink className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />}
          </motion.button>
        ))}
      </motion.div>

      {/* Pricing */}
      <div className="mt-20 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display text-3xl font-semibold"
        >
          Or upgrade to skip ads
        </motion.h2>
      </div>

      <div className="mt-10 grid gap-4 md:grid-cols-4">
        {PRICES.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.06 * i }}
            whileHover={{ y: -6 }}
            className={`glass relative rounded-2xl p-6 ${p.popular ? "ring-2 ring-brand-glow/50" : ""}`}
          >
            {p.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 brand-gradient rounded-full px-3 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                Popular
              </span>
            )}
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{p.name}</div>
            <div className="mt-3 font-display text-3xl font-semibold text-gradient">{p.price}</div>
            <div className="mt-2 text-xs text-muted-foreground">{p.note}</div>
            <div className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
              <Check className="h-3.5 w-3.5 text-success" /> HWID locked
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mt-10 text-center"
      >
        <button
          onClick={() => setShowSoon(true)}
          className="brand-gradient inline-flex items-center gap-2 rounded-xl px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-brand-glow/20 transition-transform hover:scale-[1.02]"
        >
          Purchase now
        </button>
      </motion.div>

      {showSoon && <PurchaseSoonModal onClose={() => setShowSoon(false)} />}
    </div>
  );
}

function PurchaseSoonModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="glass max-w-md rounded-2xl p-8 text-center"
      >
        <img src={logo.url} alt="" className="mx-auto h-16 w-16 rounded-xl" />
        <h2 className="mt-4 font-display text-2xl font-semibold text-gradient">Almost there</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You can purchase when we release. Join Discord to be first in line.
        </p>
        <div className="mt-6 flex gap-2">
          <a
            href={DISCORD_URL} target="_blank" rel="noreferrer"
            className="brand-gradient flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            <MessageCircle className="h-4 w-4" /> Join Discord
          </a>
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2.5 text-sm">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
