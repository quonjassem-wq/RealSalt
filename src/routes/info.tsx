import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Music, MapPin, Calendar, Github, Globe } from "lucide-react";
import logo from "@/assets/owner.png";
<img src={logo} />

export const Route = createFileRoute("/info")({
  head: () => ({
    meta: [
      { title: "Salt — Info" },
      { name: "description", content: "About the owner of Salt." },
    ],
  }),
  component: InfoPage,
});

function InfoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* animated backdrop */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <motion.div
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-brand-glow/20 blur-3xl"
        />
        <motion.div
          animate={{ x: [0, -60, 40, 0], y: [0, 70, -30, 0] }}
          transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
          className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-warning/15 blur-3xl"
        />
      </motion.div>

      <div className="mx-auto max-w-md px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-3xl p-8 text-center"
        >
          <motion.div
            className="relative mx-auto h-32 w-32"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 -m-2 rounded-full brand-gradient blur-xl opacity-60" />
            <img src={owner.url} alt="Salt" className="relative h-full w-full rounded-full object-cover ring-2 ring-border" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="mt-6 font-display text-3xl font-semibold text-gradient"
          >
            Salt
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="mt-1 font-mono text-xs text-muted-foreground"
          >
            owner · dev · sodium chloride enjoyer
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-muted-foreground"
          >
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> the kitchen</span>
            <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" /> since 2026</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="mt-6 flex items-center justify-center gap-3"
          >
            <SocialIcon Icon={Github} />
            <SocialIcon Icon={Globe} />
            <SocialIcon Icon={Music} />
          </motion.div>

          {/* spotify-style now playing */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 text-left"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md brand-gradient">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-background/30"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <Music className="h-3 w-3 text-success" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-success">Now playing</span>
              </div>
              <div className="truncate text-sm font-medium">Salt in the wound</div>
              <div className="truncate text-xs text-muted-foreground">— placeholder, hook up real Spotify in v2</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function SocialIcon({ Icon }: { Icon: React.ComponentType<{ className?: string }> }) {
  return (
    <motion.button
      whileHover={{ y: -3, scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground"
    >
      <Icon className="h-4 w-4" />
    </motion.button>
  );
}
