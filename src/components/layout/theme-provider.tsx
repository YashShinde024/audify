"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "svaraya-theme";

/**
 * Resolves the effective theme: explicit user choice wins, otherwise the
 * OS preference. Shared with the inline pre-hydration script in layout.tsx
 * so the very first paint already carries the right `dark` class (no FOUC,
 * no hydration mismatch).
 */
export function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    /* storage unavailable (private mode) — fall through */
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Applies (or removes) the `dark` class on <html>. */
export function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // `light` here is just the hydration-safe initial value; the real theme was
  // already painted by the inline script before React mounts.
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = resolveInitialTheme();
    applyThemeClass(initial);
    queueMicrotask(() => {      setThemeState(initial);
      setMounted(true);
    });

    // Follow OS preference only while the user has not made an explicit choice.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = (event: MediaQueryListEvent) => {
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem(THEME_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      if (saved !== "dark" && saved !== "light") {
        const next: Theme = event.matches ? "dark" : "light";
        applyThemeClass(next);
        setThemeState(next);
      }
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch {
      /* ignore */
    }
    applyThemeClass(newTheme);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Render a stable context until mounted so server/client markup matches.
  const value = mounted ? { theme, toggleTheme, setTheme } : { theme: "light" as Theme, toggleTheme: () => {}, setTheme: () => {} };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
