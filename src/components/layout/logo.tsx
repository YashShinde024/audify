import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "standard" | "by-nyxen";
  height?: number;
  priority?: boolean;
}

/**
 * Official Svaraya Brand Wordmark:
 * Elegant high-contrast serif typography with sweeping flourish ligature
 * and signature crimson red terminal 'a'.
 * Supports automatic light/dark mode switching via CSS classes.
 */
export function Logo({
  className,
  variant = "by-nyxen",
  height = 28,
  priority = true,
}: LogoProps) {
  // Correct aspect ratios:
  // standard: 943x303 (~3.11:1)
  // by-nyxen: 967x286 (~3.38:1)
  const width = variant === "by-nyxen" ? Math.round(height * 3.38) : Math.round(height * 3.11);
  const lightSrc = variant === "by-nyxen" ? "/images/logo-by-nyxen-light.png" : "/images/logo-light.png";
  const darkSrc = variant === "by-nyxen" ? "/images/logo-by-nyxen-dark.png" : "/images/logo-dark.png";

  return (
    <span className={cn("relative inline-flex items-center select-none shrink-0", className)}>
      {/* Light theme logo: Shown on light surfaces, hidden when inside .dark or .studio-theme */}
      <Image
        src={lightSrc}
        alt="Svaraya"
        width={width}
        height={height}
        priority={priority}
        className="h-auto max-w-full object-contain block [.dark_&]:hidden [.studio-theme_&]:hidden"
      />

      {/* Dark theme logo: Shown only when inside .dark or .studio-theme */}
      <Image
        src={darkSrc}
        alt="Svaraya"
        width={width}
        height={height}
        priority={priority}
        className="h-auto max-w-full object-contain hidden [.dark_&]:block [.studio-theme_&]:block"
      />
    </span>
  );
}
