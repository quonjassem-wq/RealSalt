import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Salt" },
      { name: "description", content: "What Salt is, who built it, and where it's going." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <motion.h1
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="font-display text-5xl font-semibold text-gradient"
      >
        About Salt
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
        className="prose prose-invert mt-8 space-y-6 text-muted-foreground"
      >
        <p className="text-lg leading-relaxed">
          Salt is a free, ad-supported executor built by a small team that cares about the product more than the marketing.
          No fake benchmarks. No bloat. Just a clean runtime that does its job.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { t: "Free forever", b: "Ad-supported on the free tier. Paid keys remove ads and unlock longer sessions." },
            { t: "100% UNC", b: "Full UNC coverage on day one." },
            { t: "98% sUNC", b: "Almost-complete sUNC coverage with more rolling in." },
            { t: "Multi-instance", b: "Working well as of the latest test." },
          ].map((x, i) => (
            <motion.div
              key={x.t}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.05 * i }}
              className="glass rounded-xl p-5"
            >
              <div className="font-display text-base font-semibold text-foreground">{x.t}</div>
              <div className="mt-1 text-sm">{x.b}</div>
            </motion.div>
          ))}
        </div>

        <p>
          We're a two-person team — Salt (owner) and Sugar (co-owner). Want to know more about the people behind it?{" "}
          <Link to="/info" className="text-foreground underline underline-offset-4 hover:text-brand-glow">
            More info about the owner
          </Link>.
        </p>
      </motion.div>
    </div>
  );
}
