import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/warn")({
  head: () => ({
    meta: [{ title: "Warning — Salt" }, { name: "robots", content: "noindex" }],
  }),
  component: WarnPage,
});

const STORAGE_KEY = "salt.sorry";

function WarnPage() {
  const [dismissed, setDismissed] = useState(false);

  function sayImSorry() {
    try { sessionStorage.setItem(STORAGE_KEY, "ok"); } catch {}
    setDismissed(true);
    window.location.href = "/";
  }

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-xl p-4">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 20 }}
        className="glass max-w-md rounded-3xl p-8 text-center"
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-warning/20 text-warning"
        >
          <AlertTriangle className="h-8 w-8" />
        </motion.div>
        <h1 className="mt-6 font-display text-2xl font-semibold text-gradient">Caught you</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Caught you trying to steal source. Say sorry to continue. Refresh won't help.
        </p>
        <button
          onClick={sayImSorry}
          className="brand-gradient mt-6 inline-flex rounded-xl px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          I'm Sorry
        </button>
      </motion.div>
    </div>
  );
}
