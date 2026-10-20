import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "standard" | "by-nyxen" | "compact" | "icon-only";
  height?: number;
  priority?: boolean;
  showSubtitle?: boolean;
}

/**
 * Official AudioMorph Brand Identity:
 * Features the signature 3D metallic crimson ribbon emblem ("AM" acoustic flow
 * with ruby star core), paired with crisp contemporary studio typography and
 * authentic creator attribution: "Developed by Nyxen · Music Expertise by Xpert Melody".
 */
export function Logo({
  className,
  variant = "by-nyxen",
  height = 32,
  priority = true,
  showSubtitle = true,
}: LogoProps) {
  if (variant === "icon-only") {
    return (
      <span className={cn("relative inline-flex items-center select-none shrink-0", className)}>
        <Image
          src="/images/audiomorph-logo.png"
          alt="AudioMorph"
          width={height * 1.5}
          height={height}
          priority={priority}
          className="h-auto w-auto max-h-8 object-contain filter drop-shadow-[0_2px_8px_rgba(230,0,38,0.35)]"
        />
      </span>
    );
  }

  return (
    <span className={cn("relative inline-flex items-center gap-2.5 select-none shrink-0 group", className)}>
      {/* 3D Ruby Ribbon Emblem */}
      <span className="relative flex items-center shrink-0">
        <Image
          src="/images/audiomorph-logo.png"
          alt="AudioMorph Emblem"
          width={Math.round(height * 1.6)}
          height={height}
          priority={priority}
          className="h-auto max-h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_2px_10px_rgba(230,0,38,0.4)]"
        />
      </span>

      {/* Brand Typography & Subtitle */}
      <span className="flex flex-col">
        <span className="flex items-center tracking-tight text-base sm:text-lg font-bold leading-none">
          <span className="text-fg transition-colors">Audio</span>
          <span className="bg-gradient-to-r from-primary via-accent-hover to-primary bg-clip-text text-transparent font-extrabold ml-[1px]">
            Morph
          </span>
        </span>

        {variant === "by-nyxen" && showSubtitle && (
          <span className="hidden sm:inline-block text-[9px] font-mono tracking-tight text-faint group-hover:text-muted transition-colors mt-0.5 whitespace-nowrap">
            Developed by Nyxen
          </span>
        )}
      </span>
    </span>
  );
}
