"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTheme } from "./theme-provider";

interface LogoProps {
  className?: string;
  variant?: "adaptive" | "by-nyxen" | "icon-only" | "light-only" | "dark-only" | "standard";
  height?: number;
  priority?: boolean;
  showSubtitle?: boolean;
}

/**
 * Official Audify Brand Logo Component:
 * - Light Mode: /images/audify-logo.png (black/ink text)
 * - Dark Mode: /images/audify-logo-alt.png (white text)
 * - Renders exactly ONE single image tag at any given time.
 * - Aspect ratio: 2172 x 724 (3:1)
 */
export function Logo({
  className,
  variant = "adaptive",
  height = 32,
  priority = true,
}: LogoProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const width = Math.round(height * 3);

  if (variant === "icon-only") {
    return (
      <span className={cn("relative inline-flex items-center select-none shrink-0", className)}>
        <Image
          src="/images/audify-icon.png"
          alt="Audify Emblem"
          width={height}
          height={height}
          priority={priority}
          className="h-auto w-auto max-h-8 object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </span>
    );
  }

  if (variant === "light-only") {
    return (
      <span className={cn("relative inline-flex items-center select-none shrink-0 group", className)}>
        <Image
          src="/images/audify-logo.png"
          alt="Audify"
          width={width}
          height={height}
          priority={priority}
          style={{ height: `${height}px`, width: "auto" }}
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </span>
    );
  }

  if (variant === "dark-only") {
    return (
      <span className={cn("relative inline-flex items-center select-none shrink-0 group", className)}>
        <Image
          src="/images/audify-logo-alt.png"
          alt="Audify"
          width={width}
          height={height}
          priority={priority}
          style={{ height: `${height}px`, width: "auto" }}
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </span>
    );
  }

  // Determine if dark mode is active:
  // On the client, document.documentElement having 'dark' is the live ground truth.
  // During SSR or fallback, theme context is used.
  const isDark =
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark") || theme === "dark"
      : theme === "dark";

  // Strictly theme-specific:
  // For variant "by-nyxen": audify-logo-by-nyxen-dark.png (dark) vs audify-logo-by-nyxen.png (light)
  // For standard/adaptive: audify-logo-alt.png (dark) vs audify-logo.png (light)
  const currentSrc =
    variant === "by-nyxen"
      ? isDark
        ? "/images/audify-logo-by-nyxen-dark.png"
        : "/images/audify-logo-by-nyxen.png"
      : isDark
      ? "/images/audify-logo-alt.png"
      : "/images/audify-logo.png";

  return (
    <span className={cn("relative inline-flex items-center select-none shrink-0 group", className)}>
      <Image
        key={currentSrc}
        src={currentSrc}
        alt={variant === "by-nyxen" ? "Audify by Nyxen" : "Audify"}
        width={width}
        height={height}
        priority={priority}
        style={{ height: `${height}px`, width: "auto" }}
        className="object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </span>
  );
}
