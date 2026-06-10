import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Download, MessageCircle, Sparkles, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "@/components/StatusBadge";
import { DISCORD_URL } from "@/components/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salt — Executor (v0.0.1)" },
      { name: "description", content: "Salt Executor. Free forever with ads. 100% UNC, 98% sUNC. Coming soon." },
    ],
  }),
  component: HomePage,
});

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: 0.05 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function HomePage() {
  const [showSoon, setShowSoon] = useState(false);

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-brand-glow/15 blur-3xl" />
        </motion.div>

        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 py-24 text-center sm:py-32">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
            <StatusBadge />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <img src={logo.url} alt="Salt" className="h-28 w-28 rounded-2xl shadow-2xl no-select" draggable={false} />
          </motion.div>

          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="mt-8 text-balance font-display text-6xl font-semibold tracking-tighter text-gradient sm:text-7xl md:text-8xl"
          >
            Salt
          </motion.h1>

          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="mt-5 max-w-xl text-balance text-base text-muted-foreground sm:text-lg"
          >
            The executor that doesn't taste like the rest. Free forever, ad-supported, built by a small team that gives a damn.
          </motion.p>

          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => setShowSoon(true)}
              className="brand-gradient group inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-brand-glow/20 transition-all hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
            >
              <Download className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
              Download Salt
            </button>
            <a
              href={DISCORD_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-6 py-3.5 text-sm font-semibold transition-all hover:scale-[1.02] hover:bg-surface-elevated active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" />
              Join Salt
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={6}
            className="mt-16 grid w-full max-w-2xl grid-cols-2 gap-4 sm:grid-cols-3"
          >
            {[
              { k: "100%", v: "UNC" },
              { k: "98%", v: "sUNC" },
              { k: "v0.0.1", v: "Build" },
            ].map((s, i) => (
              <motion.div
                key={s.v}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="glass rounded-xl p-5 text-center"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="font-display text-3xl font-semibold text-gradient">{s.k}</div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{s.v}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { Icon: Zap, title: "Fast Injection", body: "Lightweight runtime, low overhead, snappy attach." },
            { Icon: Shield, title: "Bypass Focused", body: "Team actively working on client modification bans. Use an alt during ban waves." },
            { Icon: Sparkles, title: "Multi Instance", body: "Tested and working in the latest build." },
          ].map(({ Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-6"
            >
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {showSoon && <ComingSoonModal onClose={() => setShowSoon(false)} />}
    </div>
  );
}

function ComingSoonModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
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
        <h2 className="mt-4 font-display text-2xl font-semibold text-gradient">Coming Soon</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Salt isn't out yet. Join the Discord to be the first to know.
        </p>
        <div className="mt-6 flex gap-2">
          <a
            href={DISCORD_URL} target="_blank" rel="noreferrer"
            className="brand-gradient flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Join Discord
          </a>
          <button onClick={onClose} className="rounded-lg border border-border px-4 py-2.5 text-sm">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
