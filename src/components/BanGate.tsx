import { useEffect, useState, type ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { checkBanStatus } from "@/lib/keys.functions";
import { getHwid } from "@/lib/hwid";

// Client-side ban gate: on first mount, asks the server if this visitor is banned.
// If banned and not already on /banned, redirects there.
export function BanGate({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const check = useServerFn(checkBanStatus);
  const [ban, setBan] = useState<{ reason: string; expires_at: string | null; banned_at: string } | null>(null);

  useEffect(() => {
    if (pathname === "/banned" || pathname === "/warn") return;
    check({ data: { hwid: getHwid() } }).then((r) => {
      if (r.banned) {
        sessionStorage.setItem("salt.ban", JSON.stringify(r));
        window.location.href = "/banned";
      }
    }).catch(() => {});
  }, [check, pathname]);

  return <>{children}</>;
}
