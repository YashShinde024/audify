import { cn } from "@/lib/utils";
import { Megaphone } from "@phosphor-icons/react/dist/ssr";

export type AdSlotSize = "banner" | "sidebar" | "inline";

const slotStyles: Record<AdSlotSize, { container: string; inner: string }> = {
  banner: {
    container: "mx-auto max-w-6xl px-4 sm:px-6 lg:px-8",
    inner: "h-24 sm:h-28",
  },
  sidebar: {
    container: "w-full",
    inner: "h-64 sm:h-72",
  },
  inline: {
    container: "mx-auto max-w-4xl px-4 sm:px-6 lg:px-8",
    inner: "h-20 sm:h-24",
  },
};

interface AdPlaceholderProps {
  size?: AdSlotSize;
  className?: string;
  note?: string;
  label?: string;
}

/**
 * Reserved advertising placement.
 * Renders a clearly labeled, stable-dimension slot preventing Cumulative Layout Shift (CLS).
 * Completely unobtrusive, never overlaps playback or DSP controls.
 */
export function AdPlaceholder({
  size = "banner",
  className,
  note,
  label = "Sponsor Advertisement",
}: AdPlaceholderProps) {
  return (
    <aside
      aria-label="Advertising slot"
      className={cn(slotStyles[size].container, className)}
      data-ad-slot={size}
    >
      <div className="flex flex-col items-center justify-center">
        <span className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-faint">
          {label}
        </span>
        <div
          role="img"
          aria-label="Advertising slot — layout preserved to prevent shift"
          className={cn(
            "flex w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-line/70 bg-surface/40 backdrop-blur-xs transition-colors",
            slotStyles[size].inner,
          )}
        >
          <Megaphone aria-hidden="true" size={16} className="text-faint" />
          <span className="font-mono text-xs text-faint">
            Reserved Advertising Space · 100% Free Platform Supporter
          </span>
        </div>
        {note && (
          <p className="mt-2 text-center font-mono text-[11px] text-faint">
            {note}
          </p>
        )}
      </div>
    </aside>
  );
}
