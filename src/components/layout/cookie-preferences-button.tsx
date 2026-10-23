"use client";

import { Cookie } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface CookiePreferencesButtonProps {
  className?: string;
  showIcon?: boolean;
}

export function CookiePreferencesButton({
  className,
  showIcon = true,
}: CookiePreferencesButtonProps) {
  const handleOpen = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-cookie-preferences"));
    }
  };

  return (
    <button
      type="button"
      onClick={handleOpen}
      aria-label="Manage cookie and privacy storage preferences"
      className={cn(
        "text-xs text-muted transition-colors hover:text-fg inline-flex items-center gap-1.5 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded",
        className
      )}
    >
      {showIcon && <Cookie size={14} className="text-primary shrink-0" />}
      <span>Cookie Preferences</span>
    </button>
  );
}
