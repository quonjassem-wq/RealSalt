import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import logo from "@/assets/logo.png.asset.json";
import { DISCORD_URL } from "@/components/Footer";

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help — Salt" },
      { name: "description", content: "Get help with Salt — join the Discord for support." },
    ],
  }),
  component: HelpPage,
});

function HelpPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <motion.img
        src={logo.url}
        alt="Salt"
        className="h-24 w-24 rounded-2xl no-select"
        draggable={false}
        initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.h1
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-8 font-display text-5xl font-semibold text-gradient"
      >
        Need a hand?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="mt-4 max-w-md text-balance text-muted-foreground"
      >
        The full help center is on the way. For now, the fastest way to get help is in our Discord — the team and community are there.
      </motion.p>
      <motion.a
        href={DISCORD_URL} target="_blank" rel="noreferrer"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}
        className="brand-gradient mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-brand-glow/20"
      >
        <MessageCircle className="h-4 w-4" /> Get help in Discord
      </motion.a>
    </div>
  );
}
