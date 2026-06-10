import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "salt" | "ocean" | "ember" | "light";
const KEY = "salt.theme";

type Ctx = { theme: Theme; setTheme: (t: Theme) => void };
const ThemeCtx = createContext<Ctx>({ theme: "salt", setTheme: () => {} });

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("salt");

  useEffect(() => {
    try {
      const saved = (typeof window !== "undefined" && localStorage.getItem(KEY)) as Theme | null;
      if (saved && ["salt", "ocean", "ember", "light"].includes(saved)) {
        setThemeState(saved);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const cls = document.documentElement.classList;
    ["theme-salt", "theme-ocean", "theme-ember", "theme-light"].forEach((c) => cls.remove(c));
    cls.add(`theme-${theme}`);
    try { localStorage.setItem(KEY, theme); } catch {}
  }, [theme]);

  return <ThemeCtx.Provider value={{ theme, setTheme: setThemeState }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);

export const THEMES: { id: Theme; label: string; swatch: string[] }[] = [
  { id: "salt", label: "Salt (default)", swatch: ["#1a1b25", "#2a2b38", "#ffffff"] },
  { id: "ocean", label: "Ocean", swatch: ["#0c1a2e", "#1e3a5f", "#4ec5f1"] },
  { id: "ember", label: "Ember", swatch: ["#1a0f0a", "#3a1f15", "#ff7a3a"] },
  { id: "light", label: "Light", swatch: ["#ffffff", "#f3f3f5", "#1a1b25"] },
];
