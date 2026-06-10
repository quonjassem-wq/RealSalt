import { Link } from "@tanstack/react-router";
import { MessageCircle } from "lucide-react";

export const DISCORD_URL = "https://discord.gg/yZyHEugsPF";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/50">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <p className="font-mono text-xs text-muted-foreground">
          © 2026 Salt · v0.0.1 · <span className="text-warning">Almost Released</span>
        </p>
        <div className="flex items-center gap-4">
          <Link to="/info" className="text-xs text-muted-foreground hover:text-foreground">Info</Link>
          <Link to="/credits" className="text-xs text-muted-foreground hover:text-foreground">Credits</Link>
          <a
            href={DISCORD_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="h-3.5 w-3.5" /> Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
