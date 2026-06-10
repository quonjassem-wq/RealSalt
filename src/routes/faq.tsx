import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Salt" },
      { name: "description", content: "Frequently asked questions about Salt executor." },
    ],
  }),
  component: FaqPage,
});

const FAQS: { q: string; a: string }[] = [
  { q: "Is Salt paid?", a: "Salt is going to be forever free with ads." },
  { q: "Is Salt keyless?", a: "No, Salt has a keysystem." },
  { q: "When will Salt release?", a: "On May 28 / 29." },
  {
    q: "Salt paid key prices?",
    a: "1 day = Ads (free)\n1 week = $2.99\n30 days = $9.99\nPerm key = $14.99",
  },
  { q: "Does Salt support multi-instance?", a: "Currently, it is working well since the last test." },
  {
    q: "Is Salt undetected?",
    a: "Salt's team is trying their best to bypass client modification bans, but just in case use an alt — there is a risk during ban waves.",
  },
  { q: "Anything else?", a: "More in Discord!" },
];

function useTypewriter(text: string, active: boolean, speed = 18) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) { setOut(""); return; }
    setOut("");
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [text, active, speed]);
  return out;
}

function FaqItem({ q, a, open, onToggle }: { q: string; a: string; open: boolean; onToggle: () => void }) {
  const typed = useTypewriter(a, open);
  return (
    <motion.div layout className="glass overflow-hidden rounded-xl">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-accent/30"
      >
        <span className="font-display text-base font-medium">{q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-border/50"
          >
            <div className="px-5 py-4 font-mono text-sm text-muted-foreground whitespace-pre-wrap">
              {typed}
              <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-brand-glow align-middle" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <motion.h1
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="font-display text-5xl font-semibold text-gradient"
      >
        FAQ
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="mt-3 text-sm text-muted-foreground"
      >
        Tap a question to reveal the answer.
      </motion.p>
      <div className="mt-8 space-y-3">
        {FAQS.map((f, i) => (
          <motion.div
            key={f.q}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * i }}
          >
            <FaqItem
              q={f.q} a={f.a} open={openIdx === i}
              onToggle={() => setOpenIdx((p) => (p === i ? null : i))}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
