import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Menu, X, LogIn, LogOut, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/faq", label: "FAQ" },
  { to: "/get-key", label: "Get Key" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/help", label: "Help" },
  { to: "/credits", label: "Credits" },
] as const;

export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase.from("user_roles").select("role").eq("user_id", session.user.id).eq("role", "admin").maybeSingle()
          .then(({ data }) => setIsAdmin(!!data));
      } else setIsAdmin(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        supabase.from("user_roles").select("role").eq("user_id", data.session.user.id).eq("role", "admin").maybeSingle()
          .then(({ data: d }) => setIsAdmin(!!d));
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/50 glass">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.img src={logo.url} alt="Salt" className="h-9 w-9 rounded-lg"
            whileHover={{ rotate: -8, scale: 1.05 }} transition={{ type: "spring", stiffness: 300, damping: 15 }} />
          <span className="font-display text-xl font-semibold tracking-tight text-gradient">Salt</span>
          <span className="ml-1 hidden rounded-full border border-border/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">
            v0.0.1
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className="relative rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
                {active && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-md bg-accent"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className={`relative ${active ? "text-foreground" : ""}`}>{item.label}</span>
              </Link>
            );
          })}
          {isAdmin && (
            <Link to="/admin"
              className="ml-2 inline-flex items-center gap-1 rounded-md border border-brand-glow/40 px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-accent">
              <Shield className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
          {user ? (
            <button onClick={signOut} className="ml-2 inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          ) : (
            <Link to="/auth" className="ml-2 inline-flex items-center gap-1 brand-gradient rounded-md px-3 py-1.5 text-xs font-semibold text-primary-foreground">
              <LogIn className="h-3.5 w-3.5" /> Sign in
            </Link>
          )}
        </nav>

        <button aria-label="Toggle menu" onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-muted-foreground hover:text-foreground md:hidden">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <motion.nav initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden border-t border-border/50 md:hidden">
          <div className="flex flex-col px-4 py-3">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
                {item.label}
              </Link>
            ))}
            {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-foreground">Admin</Link>}
            {user ? (
              <button onClick={signOut} className="rounded-md px-3 py-2.5 text-left text-sm text-muted-foreground">Sign out</button>
            ) : (
              <Link to="/auth" onClick={() => setOpen(false)} className="rounded-md px-3 py-2.5 text-sm text-foreground">Sign in</Link>
            )}
          </div>
        </motion.nav>
      )}
    </header>
  );
}
