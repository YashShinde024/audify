"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "audify-theme";
export const LEGACY_THEME_STORAGE_KEYS = ["audiomorph-theme", "svaraya-theme"] as const;

/**
 * Resolves the effective theme: explicit user choice wins, otherwise the
 * OS preference. Shared with the inline pre-hydration script in layout.tsx
 * so the very first paint already carries the right `dark` class (no FOUC,
 * no hydration mismatch).
 */
export function resolveInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    let saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!saved) {
      for (const legacyKey of LEGACY_THEME_STORAGE_KEYS) {
        const val = window.localStorage.getItem(legacyKey);
        if (val) {
          saved = val;
          break;
        }
      }
    }
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

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode;
  initialTheme?: Theme;
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme || "dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const initial = resolveInitialTheme();
    applyThemeClass(initial);
    try {
      document.cookie = `${THEME_STORAGE_KEY}=${initial}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      /* ignore */
    }
    setThemeState(initial);
    setMounted(true);

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
        try {
          document.cookie = `${THEME_STORAGE_KEY}=${next}; path=/; max-age=31536000; SameSite=Lax`;
        } catch {
          /* ignore */
        }
      }
    };
    media.addEventListener("change", onSystemChange);
    return () => media.removeEventListener("change", onSystemChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    // Add smooth transition class
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("theme-transitioning");
      document.cookie = `${THEME_STORAGE_KEY}=${newTheme}; path=/; max-age=31536000; SameSite=Lax`;
    }

    const updateDOM = () => {
      setThemeState(newTheme);
      try {
        localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      } catch {
        /* ignore */
      }
      applyThemeClass(newTheme);
    };

    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(updateDOM);
    } else {
      updateDOM();
    }

    setTimeout(() => {
      if (typeof document !== "undefined") {
        document.documentElement.classList.remove("theme-transitioning");
      }
    }, 450);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const value = { theme, toggleTheme, setTheme };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
