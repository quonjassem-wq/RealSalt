import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/logo.png.asset.json";

const STORAGE_KEY = "salt.sorry";

export function AntiInspect() {
  const [caught, setCaught] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "ok") return;
    } catch {}

    const sticky = () => {
      try {
        if (sessionStorage.getItem(STORAGE_KEY) === "ok") return;
      } catch {}
      setCaught(true);
    };

    const onKey = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") { e.preventDefault(); sticky(); return; }
      // Ctrl/Cmd + Shift + I / J / C
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ["I", "J", "C"].includes(e.key.toUpperCase())) {
        e.preventDefault(); sticky(); return;
      }
      // Ctrl/Cmd + U (view source)
      if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "U") {
        e.preventDefault(); sticky(); return;
      }
      // Ctrl/Cmd + S (save)
      if ((e.ctrlKey || e.metaKey) && e.key.toUpperCase() === "S") {
        e.preventDefault(); sticky(); return;
      }
    };

    const onContext = (e: MouseEvent) => { e.preventDefault(); };

    // DevTools size heuristic
    let devtoolsOpen = false;
    const check = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth;
      const heightDiff = window.outerHeight - window.innerHeight;
      const open = widthDiff > threshold || heightDiff > threshold;
      if (open && !devtoolsOpen) {
        devtoolsOpen = true;
        sticky();
      } else if (!open) {
        devtoolsOpen = false;
      }
    };
    const interval = window.setInterval(check, 1000);

    window.addEventListener("keydown", onKey);
    window.addEventListener("contextmenu", onContext);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("contextmenu", onContext);
      window.clearInterval(interval);
    };
  }, []);

  const dismiss = () => {
    try { sessionStorage.setItem(STORAGE_KEY, "ok"); } catch {}
    setCaught(false);
  };

  return (
    <AnimatePresence>
      {caught && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/95 backdrop-blur-xl no-select"
          onContextMenu={(e) => e.preventDefault()}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="glass mx-4 max-w-md rounded-2xl p-8 text-center"
          >
            <motion.img
              src={logo.url}
              alt="Salt"
              className="mx-auto h-20 w-20 rounded-xl"
              animate={{ rotate: [0, -3, 3, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            />
            <h2 className="mt-6 text-2xl font-semibold text-gradient">Caught You</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Caught you trying to get the source. Do you want to get banned?
            </p>
            <p className="mt-2 text-xs text-muted-foreground/70">
              This overlay stays until you apologize. Refreshing won't help.
            </p>
            <button
              onClick={dismiss}
              className="brand-gradient mt-6 inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
            >
              I'm Sorry
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
