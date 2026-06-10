import { createFileRoute } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Bitcoin, DollarSign, CreditCard, Wallet, MessageCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { DISCORD_URL } from "@/components/Footer";

export const Route = createFileRoute("/purchase")({
  head: () => ({
    meta: [{ title: "Purchase — Salt" }, { name: "description", content: "Buy Salt keys." }],
  }),
  component: PurchasePage,
});

type Item = { id: string; name: string; price: number };

const CATALOG: Item[] = [
  { id: "week", name: "1 Week Key", price: 2.99 },
  { id: "month", name: "30 Day Key", price: 9.99 },
  { id: "perm", name: "Permanent Key", price: 14.99 },
];

const PAYMENTS = [
  { id: "ltc", label: "Litecoin", Icon: Bitcoin, available: true },
  { id: "btc", label: "Bitcoin", Icon: Bitcoin, available: true },
  { id: "robux", label: "Robux", Icon: DollarSign, available: true },
  { id: "paypal", label: "PayPal", Icon: CreditCard, available: true },
  { id: "apple", label: "Apple Pay", Icon: Wallet, available: false },
  { id: "cashapp", label: "Cash App", Icon: DollarSign, available: false },
  { id: "venmo", label: "Venmo", Icon: DollarSign, available: false },
];

function PurchasePage() {
  const [cart, setCart] = useState<{ id: string; qty: number }[]>([]);
  const [pay, setPay] = useState<string | null>(null);
  const [showSoon, setShowSoon] = useState(false);

  const items = useMemo(() => cart.map((c) => {
    const cat = CATALOG.find((x) => x.id === c.id)!;
    return { ...cat, qty: c.qty, total: cat.price * c.qty };
  }), [cart]);
  const total = items.reduce((s, i) => s + i.total, 0);

  function add(id: string) {
    setCart((c) => {
      const ex = c.find((x) => x.id === id);
      return ex ? c.map((x) => x.id === id ? { ...x, qty: x.qty + 1 } : x) : [...c, { id, qty: 1 }];
    });
  }
  function remove(id: string) { setCart((c) => c.filter((x) => x.id !== id)); }

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      <motion.h1
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="text-center font-display text-5xl font-semibold text-gradient"
      >
        Purchase
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="mt-3 text-center text-sm text-muted-foreground"
      >
        Build your cart, pick a payment method.
      </motion.p>

      <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Catalog */}
        <div className="space-y-3">
          {CATALOG.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
              whileHover={{ y: -2 }}
              className="glass flex items-center justify-between rounded-2xl p-5"
            >
              <div>
                <div className="font-display text-lg font-semibold">{p.name}</div>
                <div className="text-sm text-muted-foreground">HWID locked · ad-free</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-display text-xl font-semibold text-gradient">${p.price}</div>
                <button
                  onClick={() => add(p.id)}
                  className="brand-gradient inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <ShoppingCart className="h-3.5 w-3.5" /> Add
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cart */}
        <motion.aside
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          className="glass h-fit rounded-2xl p-6"
        >
          <h3 className="font-display text-lg font-semibold">Cart</h3>
          <div className="mt-4 space-y-2">
            <AnimatePresence initial={false}>
              {items.length === 0 && (
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="text-sm text-muted-foreground"
                >
                  Cart is empty.
                </motion.p>
              )}
              {items.map((it) => (
                <motion.div
                  key={it.id}
                  layout
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                  className="flex items-center justify-between rounded-lg bg-surface px-3 py-2"
                >
                  <div>
                    <div className="text-sm font-medium">{it.name}</div>
                    <div className="text-[10px] text-muted-foreground">${it.price.toFixed(2)} × {it.qty}</div>
                  </div>
                  <button onClick={() => remove(it.id)} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-4">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Total</span>
            <span className="font-display text-xl font-semibold text-gradient">${total.toFixed(2)}</span>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Pay with</div>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENTS.map((m) => (
                <button
                  key={m.id}
                  disabled={!m.available}
                  onClick={() => setPay(m.id)}
                  className={`flex flex-col items-center gap-1 rounded-lg border p-2 text-[10px] transition-colors ${
                    pay === m.id ? "border-brand-glow/60 bg-accent" : "border-border hover:bg-accent/40"
                  } ${!m.available ? "opacity-40" : ""}`}
                >
                  <m.Icon className="h-4 w-4" />
                  {m.label}
                  {!m.available && <span className="text-[9px] text-muted-foreground">soon</span>}
                </button>
              ))}
            </div>
          </div>

          <button
            disabled={items.length === 0}
            onClick={() => setShowSoon(true)}
            className="brand-gradient mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            Purchase
          </button>
        </motion.aside>
      </div>

      <AnimatePresence>
        {showSoon && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
            onClick={() => setShowSoon(false)}
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="glass max-w-md rounded-2xl p-8 text-center"
            >
              <img src={logo.url} alt="" className="mx-auto h-16 w-16 rounded-xl" />
              <h2 className="mt-4 font-display text-2xl font-semibold text-gradient">You can purchase when we release</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Salt isn't out yet. Join Discord to get notified the moment payments open.
              </p>
              <div className="mt-6 flex gap-2">
                <a href={DISCORD_URL} target="_blank" rel="noreferrer"
                  className="brand-gradient flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  <MessageCircle className="h-4 w-4" /> Join Discord
                </a>
                <button onClick={() => setShowSoon(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm">Close</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
