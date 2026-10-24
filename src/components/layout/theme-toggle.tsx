"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon } from "@phosphor-icons/react";
import { motion } from "motion/react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to porcelain light theme" : "Switch to obsidian dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={`btn-icon relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-fg hover:border-line-strong hover:bg-raised transition-colors cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet ${className}`}
    >
      <motion.div
        key={isDark ? "dark" : "light"}
        initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
        transition={{ type: "spring", stiffness: 350, damping: 25 }}
        className="flex items-center justify-center"
      >
        {isDark ? (
          <Sun size={17} weight="duotone" className="text-amber-400" />
        ) : (
          <Moon size={17} weight="duotone" className="text-violet" />
        )}
      </motion.div>
    </button>
  );
}
