import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import owner from "@/assets/owner.png";
import coowner from "@/assets/coowner.png";
<img src={owner} />
<img src={coowner} />

export const Route = createFileRoute("/credits")({
  head: () => ({
    meta: [
      { title: "Credits — Salt" },
      { name: "description", content: "The team behind Salt." },
    ],
  }),
  component: CreditsPage,
});

function CreditsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <motion.h1
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-5xl font-semibold text-gradient"
      >
        Credits
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="mt-3 text-center text-sm text-muted-foreground"
      >
        The two people who built Salt.
      </motion.p>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {[
          { name: "Salt", role: "Owner", img: owner.url, accent: true },
          { name: "Sugar", role: "Co-owner", img: coowner.url, accent: false },
        ].map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.1 * i }}
            whileHover={{ y: -6 }}
            className="glass relative overflow-hidden rounded-2xl p-6 text-center"
          >
            <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-2xl">
              <img src={p.img} alt={p.name} className="h-full w-full object-cover" draggable={false} />
              <div className="absolute inset-0 ring-1 ring-inset ring-border/50" />
            </div>
            <h3 className="mt-5 font-display text-2xl font-semibold">{p.name}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">~ {p.role}</p>
            {p.accent && (
              <Link
                to="/info"
                className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                More info about owner <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
