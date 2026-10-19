/**
 * Reserved advertising placement. Renders a clearly labeled, empty slot with
 * stable dimensions to prevent layout shift. No ad provider is connected and
 * no fake ad content is shown. Connect an approved provider here later — the
 * slot never overlaps playback controls.
 */

import { cn } from "@/lib/utils";
import { Megaphone } from "@phosphor-icons/react/dist/ssr";

export type AdSlotSize = "banner" | "sidebar" | "inline";

const slotStyles: Record<AdSlotSize, { container: string; inner: string }> = {
  banner: { container: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", inner: "h-24 sm:h-28" },
  sidebar: { container: "", inner: "h-64" },
  inline: { container: "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", inner: "h-24" },
};

export function AdPlaceholder({ size = "banner", className, note }: {
  size?: AdSlotSize;
  className?: string;
  note?: string;
}) {
  return (
    <aside
      aria-label="Advertising slot (empty)"
      className={cn(slotStyles[size].container, className)}
      data-ad-slot={size}
    >
      <div
        role="img"
        aria-label="Advertising slot — no advertisement loaded"
        className={cn(
          "flex h-full w-full items-center justify-center gap-2.5 rounded-2xl border border-dashed border-line-strong bg-surface/60",
          slotStyles[size].inner,
        )}
      >
        <Megaphone aria-hidden="true" className="h-4 w-4 text-faint" />
        <span className="text-xs font-medium tracking-wide text-faint">
          Ad slot — nothing loaded
        </span>
      </div>
      {note ? <p className="mt-2 text-center text-[11px] text-faint">{note}</p> : null}
    </aside>
  );
}
